import { MyDisplay } from "../core/myDisplay";
import { Item } from "./item";

// -----------------------------------------
//
// -----------------------------------------
export class Contents extends MyDisplay {

  private _items: Array<Item> = []

  constructor(opt:any) {
    super(opt)

    const num = 4
    for(let i = 0; i < num; i++) {
      const el = document.createElement('div')
      this.el.appendChild(el)

      const item = new Item({
        el: el,
        id: i,
      }, false)
      this._items.push(item)

      // const el2 = document.createElement('div')
      // el.appendChild(el2)
      // const item2 = new Item({
      //   el: el2,
      //   id: i,
      // }, true)
      // this._items.push(item2)
    }

  }

  protected _update():void {
    super._update()

    // const x = Util.map(Math.sin(this._c * 0.01), -Func.sw() * 0.5, 0, -1, 1)
    // Tween.set(this.el, {
    //   x: x,
    // })
  }
}