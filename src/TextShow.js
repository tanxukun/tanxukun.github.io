class TextShow {

    constructor (cvs, ctx) {
        this.cvs = cvs;
        this.ctx = ctx;
        this.colors = [];
        this.width = cvs.width;
        this.height = cvs.height;
        this.bgData = Array.from(new Array(400)).map(v => {
            return {
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                step: Math.random() * 2.5 + 0.5
            }
        })
        this.end = false;
    }

    sendText = (text, fontSize = ((this.width * 0.7) / text.length), stepV = 40) => {
        this.ctx.font = `bold ${fontSize}px 微软雅黑`
        this.ctx.fillStyle = '#000000'
        this.ctx.fillRect(0, 0, this.width, this.height)
        this.ctx.fillStyle = '#ffffff'
        this.ctx.textAlign = 'center'
        this.ctx.textBaseline = 'middle'
        this.ctx.fillText(text, this.width / 2, this.height / 2)
        const data = this.ctx.getImageData(0, 0, this.width, this.height).data
        
        let index = 0
        let bl = 4
        let useIndex = 0
        for(let i=0;i<data.length;i+=4) {
            const x = index % this.width
            const y = Math.ceil(index / this.width)
            if (x%bl === 0 && y%bl === 0 && data[i] === 255 && data[i+1] === 255 && data[i+2] === 255) {
                const rx = Math.floor(Math.random() * fontSize) + this.width / 2 - fontSize / 2
                const ry = Math.floor(Math.random() * fontSize) + this.height / 2 - fontSize / 2
                const item = this.colors[useIndex]
                if (item) {
                    this.colors[useIndex] = {
                        x,
                        y,
                        rx: item.x,
                        ry: item.y,
                        stepX: Math.abs(item.x - x) / stepV,
                        stepY: Math.abs(item.y - y) / stepV
                    }
                } else {
                    this.colors[useIndex] = {
                        x,
                        y,
                        rx,
                        ry,
                        stepX: Math.abs(rx - x) / stepV,
                        stepY: Math.abs(ry - y) / stepV
                    }
                }
                useIndex++
            }
            index++
        }
        if (useIndex < this.colors.length) { 
            this.colors.splice(useIndex, this.colors.length - useIndex)
        }
    }

    render = () => {
        if(this.end) {
            return;
        }
        
        this.ctx.beginPath()
        this.ctx.clearRect(0, 0, this.width, this.height)
        this.colors.forEach(v => {
            if (v.rx > v.x) {
                v.rx-=v.stepX
                if (v.rx < v.x) {
                    v.rx = v.x
                }
            } else if (v.rx < v.x) {
                v.rx+=v.stepX
                if (v.rx > v.x) {
                    v.rx = v.x
                }
            }
            if (v.ry > v.y) {
                v.ry-=v.stepY
                if (v.ry < v.y) {
                    v.ry = v.y
                }
            } else if (v.ry < v.y) {
                v.ry+=v.stepY
                if (v.ry > v.y) {
                    v.ry = v.y
                }
            }
            this.ctx.rect(v.rx, v.ry, 3, 3)
        })
        this.bgData.forEach(v => {
            v.y = v.y > this.height ? 0 : (v.y + v.step)
            this.ctx.rect(v.x, v.y, 2, 2)
        })
        this.ctx.fill()
        requestAnimationFrame(this.render)
    }

    async awaitSendText (txt, fontSize, stepV) {
        return new Promise((resolve) => {
            this.sendText(txt, fontSize, stepV)
            this.colors.sort(v => Math.random() - 0.5)
            setTimeout(() => resolve(), 2000 + (stepV > 40 ? 1000 : 0))
        })
    }

    async run () {
        const text = ['☺', '祝：', '海苔妈妈', '生日快乐', '越来越美腻', '哈哈哈哈', '接下来', '请欣赏', '海苔妈妈专属', '流星雨'];
        for(let i = 0;i < text.length; i++) {
            await this.awaitSendText(text[i])
        }

        if(this.onEnd) {
            this.onEnd();
            this.end = true;
        } else {
            this.run();
        }
    }

    onEnd = undefined
}

