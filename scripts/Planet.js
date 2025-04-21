import { getPlanets } from "../api/databaseManager.js";

const Planet = (planet) => {
  var canvas = document.getElementById(planet.element);
  var ctx = canvas.getContext("2d");

  var img = new Image();
  img.src = planet.source;
  img.onload = function () {
    start();
  };

  var offsetX = 0;
  var speed = planet.rotation;
  var planetRadius = planet.diameter;

  function start() {
    requestAnimationFrame(animate);
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas

    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2); // Move the origin to center
    ctx.rotate(planet.tilt); // Apply axial tilt

    // Adding glow before drawing shape
    if (planet.has_atmosphere) {
      const glowOuterRadius = planetRadius + 8; // Spread
      const glowInnerRadius = planetRadius;
      const glowGradient = ctx.createRadialGradient(
        0,
        0,
        glowInnerRadius * 0.99,
        0,
        0,
        glowOuterRadius
      );
      glowGradient.addColorStop(0.005, "rgba(100, 200, 255, .9)"); // Thin solid edge
      glowGradient.addColorStop(0.07, "rgba(100, 200, 255, 0.4)");
      glowGradient.addColorStop(0.5, "rgba(100, 200, 255, 0.1)");
      glowGradient.addColorStop(1.0, "rgba(100, 200, 255, 0)");

      ctx.fillStyle = glowGradient;
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        glowOuterRadius,
        glowOuterRadius * 0.95,
        0,
        0,
        Math.PI * 2
      );
      ctx.ellipse(
        0,
        0,
        glowInnerRadius,
        glowInnerRadius * 0.95,
        0,
        0,
        Math.PI * 2,
        true
      ); // Inner edge
      ctx.closePath();
      ctx.fill("evenodd");
    }

    // Adding planet shape
    ctx.beginPath();
    ctx.ellipse(0, 0, planetRadius, planetRadius * 0.95, 0, 0, Math.PI * 2);
    ctx.clip();

    // Draw planet
    // Set up drawing range that will always cover the planet surface
    for (let i = -2; i <= 2; i++) {
      let drawX = -planetRadius + offsetX + i * img.width;

      if (i % 2 === 0) {
        // Normal image
        ctx.drawImage(img, drawX, -planetRadius);
      } else {
        // Mirrored image
        ctx.save();
        ctx.scale(-1, 1);
        ctx.drawImage(img, -drawX - img.width, -planetRadius); // Flip origin correctly
        ctx.restore();
      }
    }

    // Adding 3D effect
    let gradient = ctx.createRadialGradient(
      -planetRadius * 0.4, // light source x (left of center)
      -planetRadius * 0.4, // light source y (above center)
      planetRadius * 0.2, // bright inner circle
      0,
      0,
      planetRadius // dark outer circle
    );
    gradient.addColorStop(0, "rgba(255,255,255,0.4)");
    gradient.addColorStop(1, "rgba(0,0,0,0.7)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, planetRadius, 0, Math.PI * 2);
    ctx.fill();

    // Adding reflection
    let specular = ctx.createRadialGradient(
      -planetRadius * 0.3,
      -planetRadius * 0.3,
      1,
      -planetRadius * 0.3,
      -planetRadius * 0.3,
      planetRadius * 0.1
    );
    specular.addColorStop(0, "rgba(255,255,255,0.5)");
    specular.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = specular;
    ctx.beginPath();
    ctx.arc(0, 0, planetRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore(); // Reset canvas transform

    // Adding atmosphere blur
    if (planet.has_atmosphere) {
      ctx.save();
      ctx.shadowBlur = 15;
      ctx.shadowColor = "rgba(100,200,255,0.2)";
      ctx.beginPath();
      ctx.arc(0, 0, planetRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "rgba(0,0,0,0)";
      ctx.lineWidth = 5;
      ctx.stroke();
      ctx.restore();
    }

    // Animate offset
    offsetX += speed;
    if (offsetX >= img.width * 2) {
      offsetX -= img.width * 2;
    }

    requestAnimationFrame(animate);
  }
};

export const Planets = async () => {
  const planets = await getPlanets();
  for (const p of planets) {
    Planet(p);
  }
};
