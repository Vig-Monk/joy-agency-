<!--<template>
<RouterView/> 
</template> 
-->
<template>
  <div class="service-page">
    <div class="service-card">

      <div class="status-icon">
        <span></span>
      </div>

      <div class="status-badge">
        Service Suspended
      </div>

      <h1>Service Temporarily Unavailable</h1>

      <p>
        This service is currently unavailable.
      </p>

      <p class="secondary">
        Please contact your service provider to restore access.
      </p>

      <button @click="reload">
        Refresh
      </button>

    </div>
  </div>
</template>

<script setup>
const reload = () => window.location.reload()
</script>

<style scoped>
.service-page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f4f6fb;
  padding: 20px;
}

.service-card {
  width: 100%;
  max-width: 460px;
  background: white;
  border-radius: 18px;
  padding: 40px 32px;
  text-align: center;
  box-shadow: 0 15px 40px rgba(0,0,0,.08);
  border: 1px solid #ececec;
}

.status-icon {
  width: 72px;
  height: 72px;
  margin: 0 auto 25px;
  border-radius: 50%;
  background: #fff3f3;
  display: flex;
  align-items: center;
  justify-content: center;
}

.status-icon span {
  width: 16px;
  height: 16px;
  background: #d32f2f;
  border-radius: 50%;
  animation: pulse 1.8s infinite;
}

.status-badge {
  display: inline-block;
  background: #ffe5e5;
  color: #c62828;
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: .08em;
  text-transform: uppercase;
}

h1 {
  margin: 22px 0 15px;
  color: #222;
  font-size: 2rem;
}

p {
  margin: 8px 0;
  color: #555;
  line-height: 1.6;
}

.secondary {
  color: #888;
}

button {
  margin-top: 30px;
  padding: 12px 28px;
  border: none;
  border-radius: 10px;
  background: #222;
  color: white;
  cursor: pointer;
  font-size: 15px;
  transition: .2s;
}

button:hover {
  background: #111;
}

@keyframes pulse {
  0% { transform: scale(.8); opacity: .5; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(.8); opacity: .5; }
}
</style>