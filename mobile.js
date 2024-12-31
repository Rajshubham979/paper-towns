let highestZ = 1;

class Paper {
  holdingPaper = false;
  mouseTouchX = 0;
  mouseTouchY = 0;
  mouseX = 0;
  mouseY = 0;
  prevMouseX = 0;
  prevMouseY = 0;
  velX = 0;
  velY = 0;
  rotation = Math.random() * 30 - 15;
  currentPaperX = 0;
  currentPaperY = 0;
  rotating = false;

  init(paper) {
    const updateTransform = () => {
      paper.style.transform = `translateX(${this.currentPaperX}px) translateY(${this.currentPaperY}px) rotateZ(${this.rotation}deg)`;
    };

    const onMove = (x, y) => {
      if (!this.rotating) {
        this.mouseX = x;
        this.mouseY = y;

        this.velX = this.mouseX - this.prevMouseX;
        this.velY = this.mouseY - this.prevMouseY;
      }

      const dirX = x - this.mouseTouchX;
      const dirY = y - this.mouseTouchY;
      const dirLength = Math.sqrt(dirX * dirX + dirY * dirY);
      const dirNormalizedX = dirX / dirLength;
      const dirNormalizedY = dirY / dirLength;

      const angle = Math.atan2(dirNormalizedY, dirNormalizedX);
      let degrees = (360 + Math.round((180 * angle) / Math.PI)) % 360;

      if (this.rotating) {
        this.rotation = degrees;
      }

      if (this.holdingPaper) {
        if (!this.rotating) {
          this.currentPaperX += this.velX;
          this.currentPaperY += this.velY;
        }
        this.prevMouseX = this.mouseX;
        this.prevMouseY = this.mouseY;
        updateTransform();
      }
    };

    // Mouse Events
    paper.addEventListener('mousedown', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      if (e.button === 0) {
        this.mouseTouchX = e.clientX;
        this.mouseTouchY = e.clientY;
        this.prevMouseX = e.clientX;
        this.prevMouseY = e.clientY;
      }
      if (e.button === 2) {
        this.rotating = true;
      }
    });

    document.addEventListener('mousemove', (e) => {
      if (this.holdingPaper) {
        onMove(e.clientX, e.clientY);
      }
    });

    window.addEventListener('mouseup', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });

    // Touch Events
    paper.addEventListener('touchstart', (e) => {
      if (this.holdingPaper) return;
      this.holdingPaper = true;

      paper.style.zIndex = highestZ;
      highestZ += 1;

      const touch = e.touches[0];
      this.mouseTouchX = touch.clientX;
      this.mouseTouchY = touch.clientY;
      this.prevMouseX = touch.clientX;
      this.prevMouseY = touch.clientY;
    });

    document.addEventListener('touchmove', (e) => {
      if (this.holdingPaper) {
        const touch = e.touches[0];
        onMove(touch.clientX, touch.clientY);
      }
    });

    window.addEventListener('touchend', () => {
      this.holdingPaper = false;
      this.rotating = false;
    });
  }
}

// Initialize all `.paper` elements except `.paper.heart`
const papers = Array.from(document.querySelectorAll('.paper'));

papers.forEach((paper) => {
  if (paper.classList.contains('heart')) {
    console.log('Skipping .paper.heart'); // Debugging log
    return; // Skip initialization for .paper.heart
  }

  const p = new Paper();
  p.init(paper);
});

// Automatically play music when the page loads
window.onload = () => {
  const bgm = document.getElementById('bgm');

  // Try autoplay on page load
  bgm.play().catch((error) => {
    console.log('Autoplay error:', error);

    // Add user interaction fallback
    document.addEventListener('click', () => {
      bgm.play().catch((error) => {
        console.log('Error playing audio after user interaction:', error);
      });
    });

    document.addEventListener('touchstart', () => {
      bgm.play().catch((error) => {
        console.log('Error playing audio after touch interaction:', error);
      });
    });
  });
};
