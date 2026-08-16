/* CAMERA MOTION 3D TRAJECTORY VISUALIZER */

export class CameraVisualizer {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.cameraMode = 'dolly_in';
    this.angle = 0;
    this.animId = null;
    this.start();
  }

  setMode(mode) {
    this.cameraMode = mode;
  }

  start() {
    const loop = () => {
      this.angle += 0.03;
      this.render();
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  render() {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, w, h);

    // Draw Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 20) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 20) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Target Subject Node (Center Box)
    const cx = w / 2;
    const cy = h / 2;

    ctx.fillStyle = 'rgba(0, 117, 255, 0.2)';
    ctx.strokeStyle = '#0075ff';
    ctx.lineWidth = 1.5;
    ctx.fillRect(cx - 15, cy - 15, 30, 30);
    ctx.strokeRect(cx - 15, cy - 15, 30, 30);

    ctx.fillStyle = '#ffffff';
    ctx.font = '500 10px Inter';
    ctx.textAlign = 'center';
    ctx.fillText('SUBJECT', cx, cy + 3);

    // Calculate Camera Icon Position based on mode
    let camX = cx;
    let camY = cy + 40;
    let pathPoints = [];

    switch (this.cameraMode) {
      case 'dolly_in':
        camY = cy + 45 - (Math.sin(this.angle) * 20 + 20);
        pathPoints = [{ x: cx, y: cy + 45 }, { x: cx, y: cy + 15 }];
        break;

      case 'orbit_360':
        const radius = 38;
        camX = cx + Math.cos(this.angle) * radius;
        camY = cy + Math.sin(this.angle) * radius;
        for (let a = 0; a < Math.PI * 2; a += 0.2) {
          pathPoints.push({ x: cx + Math.cos(a) * radius, y: cy + Math.sin(a) * radius });
        }
        break;

      case 'fpv_drone':
        camX = cx + Math.sin(this.angle * 1.5) * 45;
        camY = cy + Math.cos(this.angle * 2) * 30;
        break;

      case 'crane_up':
        camY = cy + 35 - ((this.angle * 10) % 50);
        pathPoints = [{ x: cx - 25, y: cy + 35 }, { x: cx - 25, y: cy - 15 }];
        break;

      case 'bullet_time':
        const r2 = 35;
        camX = cx + Math.cos(this.angle * 0.5) * r2;
        camY = cy + Math.sin(this.angle * 0.5) * r2;
        break;

      case 'handheld_shake':
        camX = cx + (Math.random() - 0.5) * 12;
        camY = cy + 35 + (Math.random() - 0.5) * 12;
        break;

      default:
        break;
    }

    // Draw Trajectory Path Line
    if (pathPoints.length > 0) {
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(pathPoints[0].x, pathPoints[0].y);
      for (let i = 1; i < pathPoints.length; i++) {
        ctx.lineTo(pathPoints[i].x, pathPoints[i].y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // Draw Camera Vector Beam
    ctx.strokeStyle = 'rgba(59, 130, 246, 0.6)';
    ctx.beginPath();
    ctx.moveTo(camX, camY);
    ctx.lineTo(cx, cy);
    ctx.stroke();

    // Draw Camera Icon Node
    ctx.fillStyle = '#3b82f6';
    ctx.beginPath();
    ctx.arc(camX, camY, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
  }
}
