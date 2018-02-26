function Particle ()
{
    this.scale = 1.0;
    this.x = 0;
    this.y = 0;
    this.radius = 20;
    this.color = "#000";
    this.velocityX = 0;
    this.velocityY = 0;
    this.scaleSpeed = 0.5;  //This number is the value which decresae the size of the particule default=0.5
    this.useGravity = false;

    this.update = function(ms)
    {
        // shrinking

        this.scale -= this.scaleSpeed * ms / 1000.0;

        if (this.scale <= 0.85)   //This number erase the particle when is size is under this number (default=0)
        {
            // particle is dead, remove it
            removeFromArray(particles, this);

        }

        // moving away from explosion center
        this.x += this.velocityX * ms/1000.0;
        this.y += this.velocityY * ms/1000.0;

        // and then later come downwards when our
        // gravity is added to it. We should add parameters
        // for the values that fake the gravity
        if(this.useGravity) {
            this.velocityY += Math.random()*4 +4;
        }
    };

    this.draw = function(ctx)
    {
        // translating the 2D context to the particle coordinates
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.scale(this.scale, this.scale);

        // drawing a filled circle in the particle's local space
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, 0, Math.PI*2, true);
        //context2D.closePath();

        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    };
}

/*
 * Advanced Explosion effect
 * Each particle has a different size, move speed and scale speed.
 *
 * Parameters:
 * 	x, y - explosion center
 * 	color - particles' color
 */
function createExplosion(x, y, color)
{
    var minSize = 10;
    var maxSize = 30;
    var count = 10;
    var minSpeed = 60.0;
    var maxSpeed = 200.0;
    var minScaleSpeed = 1.0;
    var maxScaleSpeed = 4.0;

    for (var angle=0; angle<360; angle += Math.round(360/count))
    {
        let particle = new Particle();

        particle.x = x;
        particle.y = y;

        // size of particle
        particle.radius = randomFloat(1, 3);


        ////////////////////////////////////////////////////////////////////////////////
        //particle.color = color;
        //Celle ci créée un couleur améatoire pour chaque particule
        let r = Math.round(255 * Math.random());
        let g = Math.round(255 * Math.random());
        let b = Math.round(255 * Math.random());
        let colorRgb = "rgb(" + r + "," + g + "," + b + ")";
        particle.color = colorRgb;
        ////////////////////////////////////////////////////////////////////////////////
        // life time, the higher the value the faster particle
        // will die
        particle.scaleSpeed = randomFloat(0.3,0.5);

        // use gravity
        particle.useGravity = false;

        var speed = randomFloat(minSpeed, maxSpeed);

        particle.velocityX = speed * Math.cos(angle * Math.PI / 180.0);
        particle.velocityY = speed * Math.sin(angle * Math.PI / 180.0);

        particles.push(particle);
    }

}

// Delta = time between two consecutive frames,
// for time-based animation
function updateAndDrawParticules(delta, ctx) {
    for (var i = 0; i < particles.length; i++) {
        var particle = particles[i];

        particle.update(delta);
        particle.draw(ctx);
    }
}

function timer(currentTime) {
    var delta = currentTime - oldTime;
    oldTime = currentTime;
    return delta;

}

function removeFromArray(array, object) {
    var idx = array.indexOf(object);
    if (idx !== -1) {
        array.splice(idx, 1);
    }
    return array;
}

function startDoubleExplosion(x, y) {
    createExplosion(x, y, "red");
    // On peut multiplier la densité en générant plusieurs
    // explositons de couleurs différentes...
    createExplosion(x, y, "blue");
    //createExplosion(x, y, "green");
    //sound.play('blast');

}

function randomFloat (min, max)
{
    return min + Math.random()*(max-min);
}
