import { fabric } from "fabric";
//* It seems to work: https://jsfiddle.net/av01d/dfvp9j2u/
//* https://gist.github.com/jon-hall/2fc30039629ef22bc95c

/**
 * Class for using the fill functionality
 */
export class FloodFill {
    private enabled: boolean = false;
    /** Color in hexadecimal */
    private fillColor?: string;

    constructor(private fcanvas: fabric.Canvas, private fillTolerance: number) {
        this.initialize();
    }

    /**
     * 
     * @param fillColor Color in hexadecimal
     */
    enable(fillColor: string) {
        if (!fillColor.startsWith("#")) throw new Error("The color must be passed in hexadecimal!");

        this.enabled = true;
        this.fillColor = fillColor;
    }

    disable() {
        this.enabled = false;
    }

    /**
     * Performs the necessary configurations/subscriptions for the fill function to work
     */
    private initialize() {
        this.fcanvas.on('mouse:down', (e) => {
            if (!this.enabled) return;
            if (!this.fillColor) throw new Error("Flood-fill color was not set");

            var mouse = this.fcanvas.getPointer(e.e),
                //@ts-ignore
                canvas = this.fcanvas.lowerCanvasEl,
                factor = this.fcanvas.getWidth() / canvas.width,
                mouseX = Math.round(mouse.x / factor), mouseY = Math.round(mouse.y / factor),
                context = canvas.getContext('2d'),
                parsedColor = this.hexToRgb(this.fillColor),
                imageData = context.getImageData(0, 0, canvas.width, canvas.height),
                getPointOffset = function (x: number, y: number) {
                    return 4 * (y * imageData.width + x)
                },
                targetOffset = getPointOffset(mouseX, mouseY),
                target = imageData.data.slice(targetOffset, targetOffset + 4);

            if (this.withinTolerance(target, 0, parsedColor, this.fillTolerance)) {
                // Trying to fill something which is (essentially) the fill color
                return;
            }

            // Perform flood fill
            var data = this.fill(
                imageData.data,
                getPointOffset,
                { x: mouseX, y: mouseY },
                parsedColor,
                target,
                this.fillTolerance,
                imageData.width,
                imageData.height
            );

            if (0 == data.width || 0 == data.height) {
                return;
            }

            var tmpCanvas = document.createElement('canvas'), tmpCtx = tmpCanvas.getContext('2d');
            tmpCanvas.width = canvas.width;
            tmpCanvas.height = canvas.height;

            if (!tmpCtx) throw new Error("Não foi possivel encontrar o 'contexto' do canvas");

            var palette = tmpCtx.getImageData(0, 0, tmpCanvas.width, tmpCanvas.height); // x, y, w, h
            palette.data.set(new Uint8ClampedArray(data.coords)); // Assuming values 0..255, RGBA
            tmpCtx.putImageData(palette, 0, 0); // Repost the data.
            var imgData = tmpCtx.getImageData(data.x, data.y, data.width, data.height); // Get cropped image

            tmpCanvas.width = data.width;
            tmpCanvas.height = data.height;
            tmpCtx.putImageData(imgData, 0, 0);

            if (!this.fcanvas.viewportTransform) throw new Error("fcanvas.viewportTransform não encontrado!");

            const { scaleX, scaleY } = fabric.util.qrDecompose(this.fcanvas.viewportTransform);

            //TODO: Arrumar um jeito de fazer funcionar com zoom
            const scaleImgX = 1 / scaleX, scaleImgY = 1 / scaleY;
            const left = data.x * factor, top = data.y * factor;

            const objImg = new fabric.Image(tmpCanvas, {
                left,
                top,
                selectable: false
            })

            objImg.scale(factor);
            this.fcanvas.add(objImg);
        })
    }

    private hexToRgb(hex: string, opacity?: number) {
        opacity = opacity ? Math.round(opacity * 255) : 255;
        hex = hex.replace('#', '');
        var rgb: number[] = [], re = new RegExp('(.{' + hex.length / 3 + '})', 'g');
        hex.match(re)?.map(function (l) {
            rgb.push(parseInt(hex.length % 2 ? l + l : l, 16));
        });
        return rgb.concat(opacity);
    }

    private withinTolerance(array1: any[], offset: number, array2: any[], tolerance: number) {
        var length = array2.length,
            start = offset + length;
        tolerance = tolerance || 0;

        // Iterate (in reverse) the items being compared in each array, checking their values are
        // within tolerance of each other
        while (start-- && length--) {
            if (Math.abs(array1[start] - array2[length]) > tolerance) {
                return false;
            }
        }

        return true;
    }

    private fill(imageData: any, getPointOffsetFn: any, point: any, color: any, target: any, tolerance: any, width: number, height: number) {
        var directions = [[1, 0], [0, 1], [0, -1], [-1, 0]],
            coords = [],
            points = [point],
            seen: any = {},
            key,
            x,
            y,
            offset,
            i,
            x2,
            y2,
            minX = -1,
            maxX = -1,
            minY = -1,
            maxY = -1;

        // Keep going while we have points to walk
        while (!!(point = points.pop())) {
            x = point.x;
            y = point.y;
            offset = getPointOffsetFn(x, y);

            // Move to next point if this pixel isn't within tolerance of the color being filled
            if (!this.withinTolerance(imageData, offset, target, tolerance)) {
                continue;
            }

            if (x > maxX) { maxX = x; }
            if (y > maxY) { maxY = y; }
            if (x < minX || minX == -1) { minX = x; }
            if (y < minY || minY == -1) { minY = y; }

            // Update the pixel to the fill color and add neighbours onto stack to traverse
            // the fill area
            i = directions.length;
            while (i--) {
                // Use the same loop for setting RGBA as for checking the neighbouring pixels
                if (i < 4) {
                    imageData[offset + i] = color[i];
                    coords[offset + i] = color[i];
                }

                // Get the new coordinate by adjusting x and y based on current step
                x2 = x + directions[i][0];
                y2 = y + directions[i][1];
                key = x2 + ',' + y2;

                // If new coordinate is out of bounds, or we've already added it, then skip to
                // trying the next neighbour without adding this one
                if (x2 < 0 || y2 < 0 || x2 >= width || y2 >= height || seen[key]) {
                    continue;
                }

                // Push neighbour onto points array to be processed, and tag as seen
                points.push({ x: x2, y: y2 });
                seen[key] = true;
            }
        }

        return {
            x: minX,
            y: minY,
            width: maxX - minX,
            height: maxY - minY,
            coords: coords
        }
    }
}