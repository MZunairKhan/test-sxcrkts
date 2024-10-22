/**
 * Represents a range with minimum and maximum values
 */
export interface Range {
    min: number;
    max: number;
}

/**
 * Represents a hardware camera's capabilities
 */
export interface HardwareCamera {
    distance: Range;
    lightLevel: Range;
}