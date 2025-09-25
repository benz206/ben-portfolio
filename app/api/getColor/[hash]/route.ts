import { NextRequest, NextResponse } from "next/server";

function findNearestColor(rgbArray: number[]): number[] {
    const colors: number[][] = [
        [255, 0, 0],
        [255, 125, 0],
        [255, 255, 0],
        [125, 255, 0],
        [0, 255, 0],
        [0, 255, 125],
        [0, 255, 255],
        [0, 125, 255],
        [0, 0, 255],
        [125, 0, 255],
        [255, 0, 255],
        [255, 0, 125],
    ];
    let minDistance = Infinity;
    let closestColor: number[] = [];
    colors.forEach((color) => {
        const distance = Math.sqrt(
            Math.pow(rgbArray[0] - color[0], 2) +
                Math.pow(rgbArray[1] - color[1], 2) +
                Math.pow(rgbArray[2] - color[2], 2)
        );
        if (distance < minDistance) {
            minDistance = distance;
            closestColor = color;
        }
    });
    return closestColor;
}

export async function GET(req: NextRequest, context: { params: Promise<{ hash: string }> }) {
    const { hash } = await context.params;
    return NextResponse.json({ answer: [29, 185, 84] });
}


