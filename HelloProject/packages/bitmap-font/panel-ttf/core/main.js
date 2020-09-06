const Path=require("fire-path"),Fs=require("fire-fs"),OpenType=Editor.require("packages://bitmap-font/node_modules/opentype.js"),DefaultValue={BgColor:cc.Color.GRAY,FontSize:40,FontFamily:"Arial"},GradualDirection={Left2Right:{name:"→从左到右",value:"Left2Right"},Right2Left:{name:"←从右到左",value:"Right2Left"},Up2Down:{name:"↓从上到下",value:"Up2Down"},Down2Up:{name:"↑从下到上",value:"Down2Up"},LeftUp2RightDown:{name:"↘从左上到右下",value:"LeftUp2RightDown"},RightUp2LeftDown:{name:"↙从右上到左下",value:"RightUp2LeftDown"},LeftDown2RightUp:{name:"↗从左下到右上",value:"LeftDown2RightUp"},RightDown2LeftUp:{name:"↖从右下到左上",value:"RightDown2LeftUp"}};global.FontEngine=module.exports={GradualDirection:GradualDirection,data:null,canvas:null,context:null,allFont:[],openTypeInfo:null,bgColor:cc.Color.BLACK,space:5,textureImage:null,textureMD5:null,selectFontCB:null,updateTextureCB:null,getMaxFontSize(){let t=0,e=0;return this.allFont.forEach(n=>{t=Math.max(t,n.width),e=Math.max(e,n.height)}),{width:t,height:e}},setTextureImageData(t){let e=Fs.readFileSync(t),n=require("crypto").createHash("md5").update(e).digest("hex");if(n===this.textureMD5)return;this.textureMD5=n;let i=new Image;i.src=t,i.onload=(()=>{if(this.textureImage=i,this.data&&this.data.texture.enable){for(let t=0;t<this.allFont.length;t++){let e=this.allFont[t];e.textureEnable&&(e.dirty=!0)}this.update()}})},initEngine(t,e){return this.bgColor=e||this.bgColor,this.canvas=t,this.context=t.getContext("2d"),t.addEventListener("click",t=>{this._updateSelectFont(t)}),t.addEventListener("mousemove",t=>{let e=this._updateSelectFont(t);this.selectFontCB&&this.selectFontCB(e)}),window.addEventListener("resize",()=>{this.onResize()}),this.onResize(),this},_updateSelectFont(t){let e=null,n=t.offsetX,i=t.offsetY;for(let t=0;t<this.allFont.length;t++){let a=this.allFont[t];a.isShowBoard=a.hitTest(n,i),a.isShowBoard&&(e=a)}return this.update(),e},syncFont(t,e){this.data=e,t.syncBase(e.font),t.syncShadow(e.shadow),t.syncGradual(e.gradual),t.syncOutLine(e.outline),t.syncTexture(e.texture)},syncFonts(t){this.updateChars(t.font.string),this.bgColor=t.canvasBgColor,this.space=t.space,this.allFont.forEach(e=>{this.syncFont(e,t)})},useFont(t){this.openTypeInfo=OpenType.loadSync(t.url),FontEngine.Loader.load(t,t=>{this.allFont.forEach(e=>{e.fontFamily!==t.family&&(e.dirty=!0,e.fontFamily=t.family)}),this.update()})},onResize(){let t=this.canvas.parentElement.clientHeight,e=this.canvas.parentElement.clientWidth;this.canvas.setAttribute("height",t),this.canvas.setAttribute("width",e),this.update()},_isContainChar(t){let e=!1;for(let n=0;n<this.allFont.length;n++){if(this.allFont[n].string===t){e=!0;break}}return e},updateChars(t){if(void 0!==t&&null!==t){for(let e=0;e<this.allFont.length;){let n=this.allFont[e].string;-1===t.indexOf(n)?this.allFont.splice(e,1):e++}for(let e=0;e<t.length;e++){let n=t[e];if(!this._isContainChar(n)){let t=new FontEngine.Font;t.attachContext(this.context),t.string=n,this.allFont.push(t)}}}},_updateFontPosition(t,e,n){this.allFont.forEach(i=>{i.uuid===t&&(i.x=e,i.y=n,i.draw())})},layoutFont(t){let e=this.allFont.sort((t,e)=>{return t.string.charCodeAt(0)-e.string.charCodeAt(0)});this._layout1(e,t).forEach(t=>{this._updateFontPosition(t.meta,t.x,t.y)})},_layout2(t,e){let n=Editor.require("packages://bitmap-font/node_modules/bin-pack"),i=[];t.forEach(t=>{i.push({width:t.width+e,height:t.height+e,meta:t.uuid})});n(i,{inPlace:!0});return i},_layout1(t,e){let n=Editor.require("packages://bitmap-font/node_modules/layout")("binary-tree");return t.forEach(t=>{n.addItem({width:t.width+e,height:t.height+e,meta:t.uuid})}),n.export().items},genAllFontTexture(){let t=!1;for(let e=0;e<this.allFont.length;e++){this.allFont[e].genTexture()&&(t=!0)}return t},update(){if(this._resetBg(),this.openTypeInfo){this.genAllFontTexture()&&this.updateTextureCB&&this.updateTextureCB(),this.layoutFont(this.space||0)}},_resetBg(){let t=this.context,e=this.canvas;t.clearRect(0,0,e.width,e.height),t.fillStyle=FontEngine.Util.colorToCss(this.bgColor),t.fillRect(0,0,e.width,e.height)}},FontEngine.DefaultValue=DefaultValue;