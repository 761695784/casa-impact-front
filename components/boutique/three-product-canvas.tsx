"use client"

import React, { useRef, useEffect, useState } from "react"
import * as THREE from "three"

interface ThreeProductCanvasProps {
  imageUrl: string
  title?: string
  className?: string
  showParticles?: boolean
  showPedestal?: boolean
  autoRotateSpeed?: number
  hoverIntensity?: number
  isHero?: boolean
}

export function ThreeProductCanvas({
  imageUrl,
  title = "Produit 3D",
  className = "",
  showParticles = true,
  showPedestal = false,
  autoRotateSpeed = 1,
  hoverIntensity = 0.5,
  isHero = false,
}: ThreeProductCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovered: false })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    let animationFrameId: number
    const clock = new THREE.Clock()

    // 1. Scene Setup
    const scene = new THREE.Scene()

    // 2. Camera Setup
    const width = container.clientWidth || 300
    const height = container.clientHeight || 300
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, isHero ? 4.2 : 3.8)

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    })
    renderer.setSize(width, height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.2
    renderer.domElement.style.width = "100%"
    renderer.domElement.style.height = "100%"
    renderer.domElement.style.display = "block"
    container.appendChild(renderer.domElement)

    // 4. Studio Lighting System
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.8)
    scene.add(ambientLight)

    // Key Directional Light (Warm White)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8)
    keyLight.position.set(4, 5, 4)
    scene.add(keyLight)

    // Fill Light (Soft Emerald/Forest Tint)
    const fillLight = new THREE.DirectionalLight(0x028646, 1.6)
    fillLight.position.set(-4, -2, 2)
    scene.add(fillLight)

    // Rim / Backlight (Gold Accent)
    const rimLight = new THREE.PointLight(0xf2a20d, 3.5, 12)
    rimLight.position.set(0, 3, -3)
    scene.add(rimLight)

    // Front soft point light
    const frontGlow = new THREE.PointLight(0xffffff, 1.2, 8)
    frontGlow.position.set(0, 0, 3)
    scene.add(frontGlow)

    // 5. Product 3D Mesh Group
    const productGroup = new THREE.Group()
    scene.add(productGroup)

    // Texture Loading
    const textureLoader = new THREE.TextureLoader()
    textureLoader.load(
      imageUrl,
      (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace
        texture.generateMipmaps = true
        texture.minFilter = THREE.LinearMipmapLinearFilter
        texture.magFilter = THREE.LinearFilter

        // Calculate aspect ratio
        const imgAspect = texture.image.width / texture.image.height
        const planeHeight = isHero ? 2.3 : 1.9
        const planeWidth = planeHeight * (imgAspect || 1)

        // Front Face Material
        const frontMaterial = new THREE.MeshStandardMaterial({
          map: texture,
          transparent: true,
          side: THREE.DoubleSide,
          roughness: 0.25,
          metalness: 0.1,
          alphaTest: 0.05,
        })

        // Front Main Plane Mesh
        const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, 32, 32)

        // Give subtle 3D curved curvature to the plane so it looks volumetric
        const pos = geometry.attributes.position
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i)
          const y = pos.getY(i)
          // Subtle parabolic curve in Z axis
          const zCurve = Math.cos((x / (planeWidth / 2)) * (Math.PI / 4)) * 0.08 - 0.04
          pos.setZ(i, zCurve)
        }
        geometry.computeVertexNormals()

        const productMesh = new THREE.Mesh(geometry, frontMaterial)
        productGroup.add(productMesh)

        // Subtle Back Holographic Plaque for extra 3D depth
        const backMaterial = new THREE.MeshStandardMaterial({
          color: 0x024424,
          roughness: 0.4,
          metalness: 0.6,
          transparent: true,
          opacity: 0.35,
          side: THREE.BackSide,
        })
        const backMesh = new THREE.Mesh(geometry, backMaterial)
        backMesh.position.z = -0.01
        productGroup.add(backMesh)

        setIsLoaded(true)
      },
      undefined,
      (err) => {
        console.warn("Could not load 3D texture for", imageUrl, err)
        setIsLoaded(true)
      }
    )

    // 6. Dynamic 3D Ground Shadow Mesh
    const shadowGeo = new THREE.PlaneGeometry(1.8, 0.9)
    // Create radial shadow gradient texture
    const canvas = document.createElement("canvas")
    canvas.width = 128
    canvas.height = 128
    const ctx = canvas.getContext("2d")
    if (ctx) {
      const gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64)
      gradient.addColorStop(0, "rgba(0, 0, 0, 0.6)")
      gradient.addColorStop(0.5, "rgba(2, 68, 36, 0.25)")
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 128, 128)
    }
    const shadowTexture = new THREE.CanvasTexture(canvas)
    const shadowMat = new THREE.MeshBasicMaterial({
      map: shadowTexture,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    })
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat)
    shadowMesh.rotation.x = -Math.PI / 2
    shadowMesh.position.y = isHero ? -1.45 : -1.25
    scene.add(shadowMesh)

    // 7. Optional 3D Pedestal Ring (for Hero or Showcase)
    let pedestalMesh: THREE.Mesh | null = null
    if (showPedestal) {
      const ringGeo = new THREE.TorusGeometry(1.2, 0.025, 16, 64)
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0xf2a20d,
        emissive: 0xf2a20d,
        emissiveIntensity: 0.6,
        roughness: 0.2,
        metalness: 0.8,
      })
      pedestalMesh = new THREE.Mesh(ringGeo, ringMat)
      pedestalMesh.rotation.x = Math.PI / 2
      pedestalMesh.position.y = -1.4
      scene.add(pedestalMesh)
    }

    // 8. 3D Floating Particles (Gold & Emerald Stardust)
    let particlesMesh: THREE.Points | null = null
    if (showParticles) {
      const particleCount = isHero ? 60 : 35
      const particleGeo = new THREE.BufferGeometry()
      const particlePositions = new Float32Array(particleCount * 3)
      const particleColors = new Float32Array(particleCount * 3)

      const colorGold = new THREE.Color(0xf2a20d)
      const colorEmerald = new THREE.Color(0x34d399)
      const colorWhite = new THREE.Color(0xffffff)

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3
        particlePositions[i3] = (Math.random() - 0.5) * 3.6
        particlePositions[i3 + 1] = (Math.random() - 0.5) * 3.2
        particlePositions[i3 + 2] = (Math.random() - 0.5) * 2.5

        const randColor = Math.random()
        const col = randColor > 0.6 ? colorGold : randColor > 0.3 ? colorEmerald : colorWhite
        particleColors[i3] = col.r
        particleColors[i3 + 1] = col.g
        particleColors[i3 + 2] = col.b
      }

      particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePositions, 3))
      particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3))

      const particleMat = new THREE.PointsMaterial({
        size: isHero ? 0.045 : 0.035,
        vertexColors: true,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
      })

      particlesMesh = new THREE.Points(particleGeo, particleMat)
      scene.add(particlesMesh)
    }

    // 9. Mouse & Touch Listeners for Subtle Responsive Tilt
    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -(((e.clientY - rect.top) / rect.height) * 2 - 1)
      mouseRef.current.targetX = x
      mouseRef.current.targetY = y
      mouseRef.current.isHovered = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0
      mouseRef.current.targetY = 0
      mouseRef.current.isHovered = false
    }

    container.addEventListener("mousemove", handleMouseMove)
    container.addEventListener("mouseleave", handleMouseLeave)

    // 10. Resize Observer
    const handleResize = () => {
      if (!container) return
      const newWidth = container.clientWidth
      const newHeight = container.clientHeight
      if (newWidth > 0 && newHeight > 0) {
        camera.aspect = newWidth / newHeight
        camera.updateProjectionMatrix()
        renderer.setSize(newWidth, newHeight)
      }
    }

    const resizeObserver = new ResizeObserver(handleResize)
    resizeObserver.observe(container)

    // 11. Autonomous 3D Render Loop
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate)

      const elapsedTime = clock.getElapsedTime()
      const dt = clock.getDelta()

      // Smooth mouse interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.06
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.06

      // AUTONOMOUS 3D MOTIONS:
      // 1. Continuous Floating in Y axis
      const floatOffsetY = Math.sin(elapsedTime * 1.8 * autoRotateSpeed) * 0.12
      productGroup.position.y = floatOffsetY

      // 2. Continuous 3D Yaw Rotation (Swinging back and forth or full 3D spin)
      const autoRotY = Math.sin(elapsedTime * 1.1 * autoRotateSpeed) * 0.35
      const mouseRotY = mouseRef.current.x * hoverIntensity * 0.5
      productGroup.rotation.y = autoRotY + mouseRotY

      // 3. Continuous 3D Pitch Tilt (X axis)
      const autoRotX = Math.cos(elapsedTime * 1.4 * autoRotateSpeed) * 0.12
      const mouseRotX = -mouseRef.current.y * hoverIntensity * 0.4
      productGroup.rotation.x = autoRotX + mouseRotX

      // 4. Subtle Roll (Z axis)
      productGroup.rotation.z = Math.sin(elapsedTime * 0.9 * autoRotateSpeed) * 0.06

      // 5. Dynamic Shadow adjustments according to height
      const shadowScale = 1 - floatOffsetY * 1.5
      shadowMesh.scale.set(shadowScale, shadowScale, 1)
      shadowMat.opacity = 0.55 - floatOffsetY * 1.2

      // 6. Pedestal slow spin
      if (pedestalMesh) {
        pedestalMesh.rotation.z = elapsedTime * 0.2
      }

      // 7. Particle gentle float & swirl
      if (particlesMesh) {
        particlesMesh.rotation.y = elapsedTime * 0.08
        particlesMesh.rotation.x = Math.sin(elapsedTime * 0.05) * 0.05
      }

      renderer.render(scene, camera)
    }

    animate()

    // 12. Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId)
      container.removeEventListener("mousemove", handleMouseMove)
      container.removeEventListener("mouseleave", handleMouseLeave)
      resizeObserver.disconnect()

      // Clean up Three.js objects
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry?.dispose()
          if (Array.isArray(object.material)) {
            object.material.forEach((m) => m.dispose())
          } else if (object.material) {
            object.material.dispose()
          }
        }
      })
      renderer.dispose()
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [imageUrl, isHero, showParticles, showPedestal, autoRotateSpeed, hoverIntensity])

  return (
    <div
      ref={containerRef}
      className={`relative size-full overflow-hidden select-none ${className}`}
      style={{ touchAction: "none" }}
      aria-label={title}
    >
      {/* Fallback image while WebGL texture initializes */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center p-6 transition-opacity duration-300">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-full max-w-full object-contain opacity-50 blur-xs"
          />
        </div>
      )}
    </div>
  )
}
