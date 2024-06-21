import { MyDisplay } from "../core/myDisplay";
import { Tween } from "../core/tween";
import { Util } from "../libs/util";
import { Point } from "../libs/point";
import { Color } from "three";
import { Param } from "../core/param";
import { Val } from "../libs/val";
import { Easing } from "../libs/easing";
import { Func } from "../core/func";

// -----------------------------------------
//
// -----------------------------------------
export class Item extends MyDisplay {

  private _bg: HTMLElement
  private _edge: HTMLElement

  private _tgSVG: Array<SVGElement> = []
  private _tgPath: Array<SVGPathElement> = []
  private _clipID: Array<string> = []
  private _rate: Val = new Val(0)
  private _noise: number = Util.random(0, 1)
  private _isInner: boolean = false

  constructor(opt:any, isInner: boolean) {
    super(opt)

    this._isInner = isInner

    this.addClass('item')

    this._bg = document.createElement('div')
    this._bg.classList.add('bg')
    this.el.appendChild(this._bg)

    this._edge = document.createElement('div')
    this._edge.classList.add('edge')
    this.el.appendChild(this._edge)

    // Tween.set(this.el, {
    //   borderRadius: '50%',
    //   overflow: 'hidden',
    // })

    let col = new Color(0x000000).offsetHSL(Util.random(0, 0.2), 1, 0.5)
    if(Util.hit(10)) col = new Color(0x000000).offsetHSL(Util.random(0.5, 0.8), 1, 0.5)
    if(this._isInner) {
      // col = new Color(0x000000).offsetHSL(0, Util.random(0, 1), 0.5)
    }
    let lineCol = new Color(0x000000)
    const borderSize = Util.randomInt(1, 20)
    Tween.set(this._bg, {
      borderRadius: '50%',
      backgroundColor: col.getStyle(),
      border: borderSize + 'px dotted ' + lineCol.getStyle(),
    })
    // col = col.offsetHSL(Util.random(0, 1), 0, 0)
    col = new Color(1 - col.r, 1 - col.g, 1 - col.b)
    // lineCol = lineCol.offsetHSL(0, 0, -0.25)
    Tween.set(this._edge, {
      borderRadius: '50%',
      backgroundColor: col.getStyle(),
      // border: borderSize + 'px dotted ' + lineCol.getStyle(),
    })

    if(!this._isInner) {
      Tween.set(this._edge, {
        zIndex: 1,
      })
    }

    for(let i = 0; i < 2; i++) {
      this._clipID.push('myClipPath' + Param.instance.clipId)
      Param.instance.clipId++

      this._tgSVG[i] = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      this._tgSVG[i].classList.add('js-tgSVG')

      const clip = document.createElementNS('http://www.w3.org/2000/svg', 'clipPath')
      this._tgSVG[i].appendChild(clip)
      clip.setAttributeNS(null, 'clipPathUnits', 'objectBoundingBox')
      clip.setAttributeNS(null, 'id', this._clipID[i])

      this._tgPath[i] = document.createElementNS('http://www.w3.org/2000/svg', 'path')
      clip.appendChild(this._tgPath[i])

      Tween.set([this._bg, this._edge][i], {
        clipPath: 'url(#' + this._clipID[i] + ')',
      })
      document.body.appendChild(this._tgSVG[i])
    }

    // this._c = opt.id * 10
    this._c = Util.randomInt(0, 1000)

    // const size = Util.map(Math.sin(this._c * -0.03), 10, 100, -1, 1)
    // const size = Util.random(5, 10)
    Tween.set(this.el, {
      rotationZ: Util.randomArr([0, 90, 180, 270])
    })

    if(this._isInner) {
      this.addClass('-inner')
    }
  }


  //
  private _getPathStr(isBg: boolean): string {
    const p0 = new Point(0, 0)
    const p1 = new Point(1, 0)
    const p2 = new Point(1, 1)
    const p3 = new Point(1 - this._rate.val, 1)
    const p4 = new Point(0, this._rate.val)

    let d = ''

    if(isBg) {
      d += 'M ' + (p0.x) + ' ' + (p0.y) + ' '
      d += 'L ' + (p1.x) + ' ' + (p1.y) + ' '
      d += 'L ' + (p2.x) + ' ' + (p2.y) + ' '
      d += 'L ' + (p3.x) + ' ' + (p3.y) + ' '
      d += 'L ' + (p4.x) + ' ' + (p4.y) + ' '
      d += 'L ' + (p0.x) + ' ' + (p0.y) + ' '
    } else {
      // d += 'M ' + (p4.x) + ' ' + (p4.y) + ' '
      // d += 'Q ' + (p3.x) + ' ' + (p4.y) + ' ' + (p3.x) + ' ' + (p3.y) + ' '
      // d += 'L ' + (p0.x) + ' ' + (p2.y) + ' '
      // d += 'L ' + (p4.x) + ' ' + (p4.y) + ' '
      d += 'M ' + (p4.x) + ' ' + (p4.y) + ' '
      const offset = Util.map(Easing.instance.outExpo(this._rate.val), Util.map(this._noise, 0, 1, 0, 1), 0, 0.25, 1) * 1
      d += 'L ' + (p3.x - offset) + ' ' + (p4.y - offset * 2) + ' '
      d += 'L ' + (p3.x) + ' ' + (p3.y) + ' '
      d += 'L ' + (p4.x) + ' ' + (p4.y) + ' '
    }

    return d
  }


  protected _update():void {
    super._update()

    this._rate.val = Util.map(Math.sin(this._c * 0.1), Util.map(this._noise, 0.25, 0.5, 0, 1), 1, -1, 1)

    let w = Util.map(Math.sin(this._c * -0.03), 0.1, 30, -1, 1)

    if(this._isInner) {
      w = Util.map(Math.sin(this._c * 0.06), 1, 100, -1, 1)
      Tween.set(this.el, {
        width: w + '%',
        height: w + '%',
      })
    } else {
      Tween.set(this.el, {
        width: w + Func.val('svh', 'vw'),
        height: w + Func.val('svh', 'vw'),
      })
    }

    // Tween.set(this.el, {
    //   rotationZ: this._c
    // })

    this._tgPath.forEach((val,i) => {
      const d = this._getPathStr(i == 0)
      val.setAttributeNS(null, 'd', d)
    })
  }
}