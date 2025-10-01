<template>
  <img
    ref="imageParticleRef"
    :src="imageSrc"
    :class="cn('hidden w-32 h-32', $props.class)"
    :data-particle-gap="particleGap"
    :data-width="canvasWidth"
    :data-height="canvasHeight"
    :data-gravity="gravity"
    :data-particle-size="particleSize"
    :data-mouse-force="mouseForce"
    :data-renderer="renderer"
    :data-color="color"
    :data-color-arr="colorArr"
    :data-init-position="initPosition"
    :data-init-direction="initDirection"
    :data-fade-position="fadePosition"
    :data-fade-direction="fadeDirection"
    :data-noise="noise"
    :data-responsive-width="responsiveWidth"
  />
</template>

<script setup>
import { cn } from "@/lib/utils";
import { inspiraImageParticles } from "./inspiraImageParticles";
import { ref, onMounted } from "vue";

defineProps({
  imageSrc: { type: String, required: true },
  class: { type: String, required: false },
  canvasWidth: { type: String, required: false },
  canvasHeight: { type: String, required: false },
  gravity: { type: String, required: false },
  particleSize: { type: String, required: false },
  particleGap: { type: String, required: false },
  mouseForce: { type: String, required: false },
  renderer: { type: String, required: false },
  color: { type: String, required: false },
  colorArr: { type: Array, required: false },
  initPosition: { type: String, required: false },
  initDirection: { type: String, required: false },
  fadePosition: { type: String, required: false },
  fadeDirection: { type: String, required: false },
  noise: { type: Number, required: false },
  responsiveWidth: { type: Boolean, required: false },
});

let particles;
const imageParticleRef = ref();

onMounted(() => {
  const { InspiraImageParticle } = inspiraImageParticles();
  particles = new InspiraImageParticle(imageParticleRef.value);
});
</script>
