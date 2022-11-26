const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
canvas.width = window.document.body.clientWidth;
canvas.height = window.document.body.clientHeight;

const canvas2 = document.getElementById('canvas2');
const context2 = canvas2.getContext('2d');
canvas2.width = window.document.body.clientWidth;
canvas2.height = window.document.body.clientHeight;


const textShow = new TextShow(canvas, context);
textShow.render();
textShow.run();
textShow.onEnd = () => {
    const starrySky = new StarrySky(canvas, context, 1100);
    starrySky.draw();
    let meteorShower = new MeteorShower(canvas, context);
    meteorShower.start();
    setTimeout(() => {
        const heart = new Heart(canvas2, context2);
        heart.render();
        setTimeout(() => {
            canvas2.style.display = 'none';
        }, 10000)
    }, 3000)
}

// const starrySky = new StarrySky(canvas, context, 1100);
// starrySky.draw();

// let meteorShower = new MeteorShower(canvas, context);
//     meteorShower.start();

// const heart = new Heart(canvas, context);
// heart.render();
