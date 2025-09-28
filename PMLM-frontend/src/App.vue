<template>
  <div id="global-bg">
    <div id="particles-js"></div>
    <div class="background-overlay"></div>
  </div>
  <div class="app-content">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    // 按顺序尝试加载多个脚本，任一成功即回调
    loadScript(urls, onload) {
      if (!Array.isArray(urls)) urls = [urls]
      const tryNext = (i) => {
        if (i >= urls.length) return
        const s = document.createElement('script')
        s.src = urls[i]
        s.onload = () => onload && onload()
        s.onerror = () => tryNext(i + 1)
        document.body.appendChild(s)
      }
      tryNext(0)
    },

    // 确保 Font Awesome 样式可用（全局一次）
    ensureFontAwesome() {
      const isFaReady = () => {
        try {
          if (document.fonts && document.fonts.check) {
            return (
              document.fonts.check('900 16px "Font Awesome 6 Free"') ||
              document.fonts.check('400 16px "Font Awesome 6 Brands"')
            )
          }
        } catch (_) {}
        return !!document.querySelector('link[href*="font-awesome"]')
      }
      if (isFaReady()) return

      const urls = [
        'https://cdn.bootcdn.net/ajax/libs/font-awesome/6.5.2/css/all.min.css',
        'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css'
      ]
      const tryNext = (i) => {
        if (i >= urls.length) return
        const link = document.createElement('link')
        link.rel = 'stylesheet'
        link.href = urls[i]
        link.crossOrigin = 'anonymous'
        link.onerror = () => tryNext(i + 1)
        document.head.appendChild(link)
      }
      tryNext(0)
    },

    // 粒子配置
    getParticlesConfig() {
      return {
        particles: {
          number: { value: 80, density: { enable: true, value_area: 800 } },
          color: { value: '#ffffff' },
          shape: { type: 'circle' },
          opacity: {
            value: 0.2,
            random: true,
            anim: { enable: false, speed: 0, opacity_min: 0.1, sync: false }
          },
          size: {
            value: 3,
            random: true,
            anim: { enable: false, speed: 0, size_min: 0.1, sync: false }
          },
          line_linked: {
            enable: true,
            distance: 150,
            color: '#1E88E5',
            opacity: 0.1,
            width: 1
          },
          move: {
            enable: true,
            speed: 1,
            direction: 'none',
            random: true,
            straight: false,
            out_mode: 'out',
            bounce: false,
            attract: { enable: false, rotateX: 600, rotateY: 1200 }
          }
        },
        interactivity: {
          detect_on: 'canvas',
          events: {
            onhover: { enable: true, mode: 'grab' },
            onclick: { enable: true, mode: 'push' },
            resize: true
          },
          modes: {
            grab: { distance: 140, line_linked: { opacity: 0.5 } },
            push: { particles_nb: 4 }
          }
        },
        retina_detect: true
      }
    },

    // 销毁粒子实例
    destroyParticles() {
      if (window.pJSDom && window.pJSDom.length) {
        try {
          window.pJSDom.forEach(i => i.pJS && i.pJS.fn.vendors.destroypJS && i.pJS.fn.vendors.destroypJS())
          window.pJSDom = []
        } catch (_) {}
      }
    },

    // 初始化粒子
    initParticles() {
      const setup = () => {
        if (!window.particlesJS) return
        this.destroyParticles()
        window.particlesJS('particles-js', this.getParticlesConfig())
      }

      if (!window.particlesJS) {
        this.loadScript([
          'https://cdn.bootcdn.net/ajax/libs/particles.js/2.0.0/particles.min.js',
          'https://cdn.jsdelivr.net/npm/particles.js@2.0.0/particles.min.js'
        ], setup)
      } else {
        setup()
      }
    }
  },
  mounted() {
    this.ensureFontAwesome()
    this.initParticles()
  },
  beforeUnmount() {
    this.destroyParticles()
  }
}
</script>

<style>
/* 全局背景容器：固定在视口，覆盖全站 */
#global-bg {
  position: fixed;
  inset: 0;
  background: linear-gradient(135deg, #0D1726, #1E2A3B);
  z-index: 0;
  pointer-events: none; /* 背景不拦截交互 */
}

/* 粒子与光晕层占满背景容器 */
#particles-js,
.background-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
}

#particles-js { pointer-events: none; }

.background-overlay {
  background: radial-gradient(circle at 20% 30%, rgba(30, 136, 229, 0.15) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(0, 229, 255, 0.1) 0%, transparent 40%);
}

/* 应用内容层：在背景之上 */
.app-content {
  position: relative;
  z-index: 1;
  min-height: 100vh;
}
</style>
