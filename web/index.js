// 初始化粒子背景
document.addEventListener('DOMContentLoaded', function () {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80, density: { enable: true, value_area: 800 } },
            color: { value: "#ffffff" },
            shape: { type: "circle" },
            opacity: {
                value: 0.2,
                random: true,
                anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false }
            },
            size: {
                value: 3,
                random: true,
                anim: { enable: true, speed: 2, size_min: 0.1, sync: false }
            },
            line_linked: {
                enable: true,
                distance: 150,
                color: "#1E88E5",
                opacity: 0.1,
                width: 1
            },
            move: {
                enable: true,
                speed: 1,
                direction: "none",
                random: true,
                straight: false,
                out_mode: "out",
                bounce: false,
                attract: { enable: false, rotateX: 600, rotateY: 1200 }
            }
        },
        interactivity: {
            detect_on: "canvas",
            events: {
                onhover: { enable: true, mode: "grab" },
                onclick: { enable: true, mode: "push" },
                resize: true
            },
            modes: {
                grab: { distance: 140, line_linked: { opacity: 0.5 } },
                push: { particles_nb: 4 }
            }
        },
        retina_detect: true
    });
});

document.querySelectorAll('.identity-option').forEach(option => {
    option.addEventListener('click', function () {
        const identity = this.getAttribute('data-identity');

        document.querySelectorAll('.identity-option').forEach(opt => {
            opt.classList.remove('active');
        });
        this.classList.add('active');

        const slider = document.querySelector('.identity-slider');
        slider.style.left = identity === 'patient' ? '4px' : 'calc(50% + 4px)';

        document.getElementById('patient-form').style.display = identity === 'patient' ? 'block' : 'none';
        document.getElementById('doctor-form').style.display = identity === 'doctor' ? 'block' : 'none';
    });
});

document.getElementById('patient-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('patient-name').value;
    const number = document.getElementById('patient-number').value;
    alert(`病人登录: 姓名-${name}, 住院号/卡号-${number}`);
});

document.getElementById('doctor-form').addEventListener('submit', function (e) {
    e.preventDefault();
    const name = document.getElementById('doctor-name').value;
    const phone = document.getElementById('doctor-phone').value;
    alert(`医生登录: 姓名-${name}, 手机号-${phone}`);
});

document.querySelector('.register-btn').addEventListener('click', function () {
    alert('跳转到注册页面');
});