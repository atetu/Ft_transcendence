import { Rectangle } from "./Shape";

export class Paddle extends Rectangle {
  constructor(x: number, y: number) {
    super(x, y, 20, 100);
  }

  toMiddleOf(height: number) {
    this.y = height / 2 - this.height / 2;
  }
}
