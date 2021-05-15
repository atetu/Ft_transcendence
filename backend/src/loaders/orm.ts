import * as typeorm from "typeorm";
import * as typedi from "typedi";

export default async () => {
  typeorm.useContainer(typedi.Container);
  
  await typeorm.createConnection();
};
