let canvas = document.querySelector('canvas');
let context = canvas.getContext('2d');
canvas.width = window.document.body.clientWidth;
canvas.height = window.document.body.clientHeight;



// const textShow = new TextShow(canvas, context);
// textShow.render();
// textShow.run();
// textShow.onEnd = () => {
    const starrySky = new StarrySky(canvas, context, 1100);
    starrySky.draw();
    let meteorShower = new MeteorShower(canvas, context);
    meteorShower.start();
    // setTimeout(() => {
        const heart = new Heart(canvas, context);
        heart.render();
    // }, 3000)
// }

// const starrySky = new StarrySky(canvas, context, 1100);
// starrySky.draw();

// let meteorShower = new MeteorShower(canvas, context);
//     meteorShower.start();

// const heart = new Heart(canvas, context);
// heart.render();
