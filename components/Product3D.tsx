import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';

export default function Product3D({ modelUrl }: { modelUrl: string }) {
  const { scene } = useGLTF(modelUrl);
  return (
    <div className="h-[500px] w-full bg-[#FAFAFA] rounded-[40px]">
      <Canvas dpr={[1, 2]} shadows camera={{ fov: 45 }}>
        <Stage environment="city" intensity={0.5}>
          <primitive object={scene} scale={1.5} />
        </Stage>
        <OrbitControls autoRotate enableZoom={false} />
      </Canvas>
    </div>
  );
}