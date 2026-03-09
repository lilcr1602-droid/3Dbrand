let scene, camera, renderer, particles;

function initThreeJS() {
    const canvas = document.getElementById('canvas');
    
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);

    const light1 = new THREE.PointLight(0x667eea, 1, 100);
    light1.position.set(10, 10, 10);
    scene.add(light1);

    const light2 = new THREE.PointLight(0x764ba2, 0.5, 100);
    light2.position.set(-10, -10, 10);
    scene.add(light2);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambientLight);

    createParticles();
    createRotatingCube();

    window.addEventListener('resize', onWindowResize);

    animate();
}

function createParticles() {
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 500;

    const posArray = new Float32Array(particlesCount * 3);

    for (let i = 0; i < particlesCount * 3; i += 3) {
        posArray[i] = (Math.random() - 0.5) * 20;
        posArray[i + 1] = (Math.random() - 0.5) * 20;
        posArray[i + 2] = (Math.random() - 0.5) * 20;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x667eea,
        sizeAttenuation: true,
    });

    particles = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particles);
}

function createRotatingCube() {
    const geometry = new THREE.IcosahedronGeometry(2, 4);
    const material = new THREE.MeshStandardMaterial({
        color: 0x667eea,
        metalness: 0.7,
        roughness: 0.2,
        wireframe: false,
    });

    const cube = new THREE.Mesh(geometry, material);
    scene.add(cube);

    gsap.to(cube.rotation, {
        x: Math.PI * 2,
        y: Math.PI * 2,
        duration: 8,
        repeat: -1,
        ease: 'none',
    });
}

function animate() {
    requestAnimationFrame(animate);

    if (particles) {
        particles.rotation.x += 0.0001;
        particles.rotation.y += 0.0001;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

document.addEventListener('mousemove', (event) => {
    if (particles) {
        particles.rotation.x = event.clientY * 0.0001;
        particles.rotation.y = event.clientX * 0.0001;
    }
});

document.querySelectorAll('.nav-menu a').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        }
    });
});

document.querySelector('.cta-button').addEventListener('click', () => {
    document.querySelector('#services').scrollIntoView({ behavior: 'smooth' });
});

document.querySelector('.contact-form').addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Thank you for your message! We will get back to you soon.');
    document.querySelector('.contact-form').reset();
});

document.addEventListener('DOMContentLoaded', initThreeJS);