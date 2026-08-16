/* NODE-BASED AI CANVAS EDITOR */

export class NodeCanvasEditor {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement.getContext('2d');
    this.nodes = [
      { id: 1, title: 'Text Prompt Node', type: 'input', x: 80, y: 120, width: 220, height: 110, value: 'Rainy Cyberpunk Neo Tokyo Street' },
      { id: 2, title: 'Camera Motion Node', type: 'camera', x: 360, y: 100, width: 200, height: 120, value: 'FPV Drone Swoop 360°' },
      { id: 3, title: 'Soul ID Character', type: 'character', x: 360, y: 260, width: 200, height: 100, value: 'Kira Vance Pilot' },
      { id: 4, title: 'Seedance 2.0 Engine', type: 'model', x: 640, y: 160, width: 220, height: 130, value: '4K Ultra 60FPS' },
      { id: 5, title: 'Rendered Video Output', type: 'output', x: 940, y: 170, width: 240, height: 150, value: 'Ready to Export MP4' }
    ];
    this.connections = [
      { from: 1, to: 2 },
      { from: 1, to: 3 },
      { from: 2, to: 4 },
      { from: 3, to: 4 },
      { from: 4, to: 5 }
    ];
    this.draggedNode = null;
    this.dragOffset = { x: 0, y: 0 };
    this.animId = null;

    this.initEvents();
    this.startLoop();
  }

  initEvents() {
    this.canvas.addEventListener('mousedown', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      for (let i = this.nodes.length - 1; i >= 0; i--) {
        const n = this.nodes[i];
        if (mouseX >= n.x && mouseX <= n.x + n.width && mouseY >= n.y && mouseY <= n.y + n.height) {
          this.draggedNode = n;
          this.dragOffset = { x: mouseX - n.x, y: mouseY - n.y };
          break;
        }
      }
    });

    this.canvas.addEventListener('mousemove', (e) => {
      if (this.draggedNode) {
        const rect = this.canvas.getBoundingClientRect();
        this.draggedNode.x = e.clientX - rect.left - this.dragOffset.x;
        this.draggedNode.y = e.clientY - rect.top - this.dragOffset.y;
      }
    });

    this.canvas.addEventListener('mouseup', () => {
      this.draggedNode = null;
    });
  }

  startLoop() {
    let t = 0;
    const loop = () => {
      t += 0.03;
      this.render(t);
      this.animId = requestAnimationFrame(loop);
    };
    loop();
  }

  render(time) {
    const w = this.canvas.width;
    const h = this.canvas.height;
    const ctx = this.ctx;

    // Background Dark Grid
    ctx.fillStyle = '#06070a';
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 30) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    // Render Cable Connections
    this.connections.forEach(conn => {
      const fromNode = this.nodes.find(n => n.id === conn.from);
      const toNode = this.nodes.find(n => n.id === conn.to);

      if (fromNode && toNode) {
        const startX = fromNode.x + fromNode.width;
        const startY = fromNode.y + fromNode.height / 2;
        const endX = toNode.x;
        const endY = toNode.y + toNode.height / 2;

        const cp1X = startX + 60;
        const cp1Y = startY;
        const cp2X = endX - 60;
        const cp2Y = endY;

        ctx.strokeStyle = 'rgba(59, 130, 246, 0.5)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(startX, startY);
        ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, endX, endY);
        ctx.stroke();

        // Pulsing Data Flow Particle along cable
        const pulseRatio = (time * 0.5) % 1;
        const px = (1 - pulseRatio) * (1 - pulseRatio) * startX + 2 * (1 - pulseRatio) * pulseRatio * cp1X + pulseRatio * pulseRatio * endX;
        const py = (1 - pulseRatio) * (1 - pulseRatio) * startY + 2 * (1 - pulseRatio) * pulseRatio * cp1Y + pulseRatio * pulseRatio * endY;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(px, py, 4, 0, Math.PI * 2);
        ctx.fill();
      }
    });

    // Render Nodes
    this.nodes.forEach(n => {
      // Node Card Skeuomorphism
      ctx.fillStyle = '#0f1118';
      ctx.strokeStyle = n.type === 'output' ? '#3b82f6' : 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1.5;

      ctx.beginPath();
      ctx.roundRect(n.x, n.y, n.width, n.height, 10);
      ctx.fill();
      ctx.stroke();

      // Node Header Banner
      const headerGrad = ctx.createLinearGradient(n.x, n.y, n.x + n.width, n.y);
      headerGrad.addColorStop(0, n.type === 'output' ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.35)');
      headerGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = headerGrad;
      ctx.beginPath();
      ctx.roundRect(n.x, n.y, n.width, 32, [10, 10, 0, 0]);
      ctx.fill();

      // Title Text
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 12px Inter';
      ctx.fillText(n.title, n.x + 12, n.y + 20);

      // Node Inner Value
      ctx.fillStyle = '#8e95a5';
      ctx.font = '500 11px Inter';
      ctx.fillText(n.value, n.x + 12, n.y + 55);

      // Output / Input Socket Pins
      ctx.fillStyle = '#3b82f6';
      ctx.beginPath();
      ctx.arc(n.x, n.y + n.height / 2, 5, 0, Math.PI * 2);
      ctx.arc(n.x + n.width, n.y + n.height / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    });
  }
}
