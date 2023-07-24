export interface MapConfig {
  id: string;
  name: string | null;
  description: string | null;

  cellWidth: number;
  cellHeight: number;
  cells: number[][];

  livingCellCount: number;
  generationCount: number;
  isGameOver: boolean;

  fps: number;
}
