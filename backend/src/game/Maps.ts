import { HEIGHT, WIDTH } from "./Constants";
import { Map } from "./Map";
import { Rectangle } from "./Shape";

const tenthWidth = WIDTH / 10
const tenthHeight = HEIGHT / 10

export default [
  new Map("pause", [
    new Rectangle(tenthWidth * 3, tenthHeight * 2, tenthWidth, tenthHeight * 5),
    new Rectangle(tenthWidth * 6, tenthHeight * 2, tenthWidth, tenthHeight * 5),
  ]),
  new Map("normal", []),
  new Map("pipe", [
    new Rectangle(tenthWidth * 2, tenthHeight * 3, tenthWidth * 6, tenthHeight),
    new Rectangle(tenthWidth * 2, tenthHeight * 6, tenthWidth * 6, tenthHeight),
  ]),
  new Map("square", [
    new Rectangle(tenthWidth * 3, tenthHeight * 2, tenthWidth, tenthHeight * 2),
    new Rectangle(tenthWidth * 6, tenthHeight * 2, tenthWidth, tenthHeight * 2),
    new Rectangle(tenthWidth * 3, tenthHeight * 6, tenthWidth, tenthHeight * 2),
    new Rectangle(tenthWidth * 6, tenthHeight * 6, tenthWidth, tenthHeight * 2),
  ]),
];
