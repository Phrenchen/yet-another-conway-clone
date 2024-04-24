export interface MapConfig {
  id: string;
  name: string | null;
  description: string | null;

  cellWidth: number;
  cellHeight: number;
  cells: number[][];        // 0 = dead, 1 = alive

  livingCellCount: number;
  generationCount: number;
  isGameOver: boolean;

  fps: number;
}
