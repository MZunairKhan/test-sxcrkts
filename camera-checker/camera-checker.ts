import { Range, HardwareCamera } from "./models";

function analyzeCameraCoverage(
    desiredDistance: Range,
    desiredLight: Range,
    cameras: HardwareCamera[]
): boolean {
    
    if (!isValidRange(desiredDistance) || !isValidRange(desiredLight)) {
        throw new Error('Invalid desired ranges');
    }
    if (!Array.isArray(cameras) || cameras.length === 0) {
        throw new Error('Invalid cameras array');
    }

    const sortedCameras = [...cameras].sort((a, b) => a.distance.min - b.distance.min);

    const distanceGaps = findGaps(desiredDistance, sortedCameras, 'distance');
    const lightGaps = findGaps(desiredLight, sortedCameras, 'lightLevel');

    const hasFullCoverage = distanceGaps.length === 0 && lightGaps.length === 0;

    return hasFullCoverage;
}

function isValidRange(range: Range): boolean {
    return (
        range &&
        typeof range.min === 'number' &&
        typeof range.max === 'number' &&
        range.min >= 0 &&
        range.max > range.min
    );
}

function findGaps(
    desired: Range,
    cameras: HardwareCamera[],
    dimension: keyof Pick<HardwareCamera, 'distance' | 'lightLevel'>
): Range[] {
    const gaps: Range[] = [];
    let current = desired.min;

    while (current < desired.max) {

        const coveringCameras = cameras.filter(camera => 
            current >= camera[dimension].min && 
            current <= camera[dimension].max
        );

        if (coveringCameras.length === 0) {
            let nextCoveragePoint = desired.max;
            cameras.forEach(camera => {
                if (camera[dimension].min > current && camera[dimension].min < nextCoveragePoint) {
                    nextCoveragePoint = camera[dimension].min;
                }
            });

            gaps.push({
                min: current,
                max: nextCoveragePoint
            });
            current = nextCoveragePoint;
        } else {
            const maxCoverage = Math.min(
                desired.max,
                Math.max(...coveringCameras.map(c => c[dimension].max))
            );
            current = maxCoverage;
        }
    }

    return gaps;
}

/* Test */

const desiredRanges = {
    light: { min: 10, max: 1000 } as Range,
    distance: { min: 0.1, max: 10 } as Range
};

const availableCameras: HardwareCamera[] = [
    {
        distance: { min: 0.1, max: 1 },
        lightLevel: { min: 10, max: 100 }
    },
    {
        distance: { min: 0.8, max: 5 },
        lightLevel: { min: 50, max: 500 }
    },
    {
        distance: { min: 4, max: 10 },
        lightLevel: { min: 200, max: 1000 }
    }
];

const result = analyzeCameraCoverage(
    desiredRanges.distance,
    desiredRanges.light,
    availableCameras
);

console.log(result);