<template>
  <div class="login-card card">
    <div class="login-header">
      <h2>医疗系统登录</h2>
      <p>请选择您的身份并登录系统</p>
    </div>

    <div class="identity-selector">
      <div class="identity-slider" :style="sliderStyle"></div>
      <div
        class="identity-option"
        :class="{ active: identity === 'patient' }"
        data-identity="patient"
        @click="setIdentity('patient')"
      >病人登录</div>
      <div
        class="identity-option"
        :class="{ active: identity === 'doctor' }"
        data-identity="doctor"
        @click="setIdentity('doctor')"
      >医生登录</div>
    </div>

    <!-- 病人表单 -->
    <form v-show="identity === 'patient'" id="patient-form" class="login-form" @submit.prevent="submitPatient">
      <div class="input-group">
        <i class="fa-solid fa-user"></i>
        <input type="text" v-model="patientName" id="patient-name" placeholder="请输入姓名" required />
      </div>
      <div class="input-group">
        <i class="fa-solid fa-id-card"></i>
        <input type="text" v-model="patientNumber" id="patient-number" placeholder="请输入住院号/卡号" required />
      </div>
      <button type="submit" class="login-btn">登 录</button>
    </form>

    <!-- 医生表单（修改为用户名/密码，匹配后端登录接口 username/password） -->
    <form v-show="identity === 'doctor'" id="doctor-form" class="login-form" @submit.prevent="submitDoctor">
      <div class="input-group">
        <i class="fa-solid fa-user-doctor"></i>
        <input type="text" v-model="doctorUsername" id="doctor-username" placeholder="用户名 (如: doctor)" required />
      </div>
      <div class="input-group">
        <i class="fa-solid fa-lock"></i>
        <input type="password" v-model="doctorPassword" id="doctor-password" placeholder="密码 (如: 123456)" required />
      </div>
      <button type="submit" class="login-btn">登 录</button>
    </form>

    <div class="register-section">
      <p class="register-text">还没有账号？</p>
      <button class="register-btn" @click="onRegister">立即注册</button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LoginCard',
  data() {
    return {
      identity: 'patient',
      patientName: '',
      patientNumber: '',
      // 改为医生的用户名/密码字段，匹配后端 login 接口期望的 username/password
      doctorUsername: '',
      doctorPassword: ''
    };
  },
  computed: {
    sliderStyle() {
      return {
        left: this.identity === 'patient' ? '4px' : 'calc(50% + 4px)'
      };
    }
  },
  methods: {
    setIdentity(type) {
      this.identity = type;
    },
    submitPatient() {
      this.$emit('patient-submit', { name: this.patientName, number: this.patientNumber });
      alert(`病人登录: 姓名-${this.patientName}, 住院号/卡号-${this.patientNumber}`);
    },
    submitDoctor() {
      // Emit username/password，后端期望的字段名为 username/password
      this.$emit('doctor-submit', { username: this.doctorUsername, password: this.doctorPassword });
      alert(`医生登录: 用户名-${this.doctorUsername}`);
    },
    onRegister() {
      this.$emit('register');
      alert('跳转到注册页面');
    }
  }
};
</script>

<style scoped>
.login-card {
  background: var(--card-bg, rgba(30, 40, 60, 0.8));
  padding: 2.5rem;
  border-radius: 16px;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle, rgba(0, 229, 255, 0.1) 0%, transparent 70%);
  transform: rotate(0deg);
  z-index: -1;
}

.login-header {
  text-align: center;
  margin-bottom: 1.5rem;
}

.login-header h2 {
  color: var(--accent, #00E5FF);
  font-size: 28px;
  margin-bottom: 10px;
  font-weight: 600;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
}

.login-header p {
  color: #CCCCCC;
  font-size: 16px;
}

.identity-selector {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.2);
  padding: 4px;
  position: relative;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.identity-option {
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
  text-align: center;
  flex: 1;
  z-index: 2;
  transition: all 0.3s ease;
  font-weight: 500;
  color: #CCCCCC;
}

.identity-slider {
  position: absolute;
  height: calc(100% - 8px);
  width: calc(50% - 4px);
  background: var(--primary, #1E88E5);
  border-radius: 10px;
  top: 4px;
  left: 4px;
  z-index: 1;
  transition: all 0.3s ease;
  box-shadow: 0 0 15px rgba(30, 136, 229, 0.5);
}

.identity-option.active {
  color: white;
}

.input-group {
  margin: 1.5rem 0;
  position: relative;
}

.input-group i {
  position: absolute;
  left: 15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--accent, #00E5FF);
  z-index: 2;
}

.input-group input {
  width: 100%;
  padding: 15px 15px 15px 45px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  color: var(--text, #FFFFFF);
  font-size: 16px;
  transition: all 0.3s ease;
  background: var(--input-bg, rgba(255, 255, 255, 0.1));
}

.input-group input:focus {
  outline: none;
  border-color: var(--accent, #00E5FF);
  box-shadow: 0 0 0 3px rgba(0, 229, 255, 0.2);
}

.input-group input::placeholder {
  color: #AAAAAA;
}

.login-btn {
  background: linear-gradient(135deg, var(--primary, #1E88E5), var(--secondary, #1565C0));
  color: white;
  padding: 15px;
  border: none;
  border-radius: 10px;
  width: 100%;
  cursor: pointer;
  transition: all 0.3s;
  font-size: 16px;
  font-weight: 600;
  margin-top: 10px;
  position: relative;
  overflow: hidden;
}

.login-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: all 0.5s;
}

.login-btn:hover::before {
  left: 100%;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(30, 136, 229, 0.4);
}

.register-section {
  text-align: center;
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.register-text {
  color: #CCCCCC;
  margin-bottom: 10px;
}

.register-btn {
  background: transparent;
  color: var(--accent, #00E5FF);
  border: 1px solid var(--accent, #00E5FF);
  padding: 10px 20px;
  border-radius: 50px;
  cursor: pointer;
  transition: all 0.3s;
  font-weight: 500;
  position: relative;
  overflow: hidden;
}

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 100%;
  background: rgba(0, 229, 255, 0.1);
  transition: all 0.3s;
  z-index: -1;
}

.register-btn:hover::before {
  width: 100%;
}

.register-btn:hover {
  background: rgba(0, 229, 255, 0.1);
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.3);
}

@media (max-width: 500px) {
  .login-card {
    padding: 1.5rem;
  }

  .identity-option {
    padding: 8px 15px;
    font-size: 14px;
  }
}
</style>
