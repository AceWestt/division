import React, { useRef, useState } from 'react';
import logoMain from '../../images/logomain.svg';
import { Curtains } from 'react-curtains';
import { Plane, useCurtains } from 'react-curtains';
import { Vec2 } from 'curtainsjs';
import { vertexShader, fragmentShader } from '../../utils/shaders/shaders';

const LogoHolder = ({ onReadyCallBack }) => {
	const resetRef = useRef(null);
	return (
		<div className="logo-holder">
			<Curtains
				pixelRatio={Math.min(1.5, window.devicePixelRatio)}
				watchScroll={false}
			>
				<Curtain resetRef={resetRef} onReadyCallBack={onReadyCallBack} />
			</Curtains>
		</div>
	);
};

const Curtain = ({ resetRef, onReadyCallBack }) => {
	const [plane, setPlane] = useState(null);

	const mousePosition = useRef(new Vec2());
	const mouseLastPosition = useRef(new Vec2());

	const deltas = useRef({
		max: 0,
		applied: 0,
	});

	const uniforms = {
		resolution: {
			name: 'uResolution',
			type: '2f',
			value: [0, 0],
		},
		time: {
			name: 'uTime',
			type: '1f',
			value: 0,
		},
		mousePosition: {
			name: 'uMousePosition',
			type: '2f',
			value: mousePosition.current,
		},
		mouseMoveStrength: {
			name: 'uMouseMoveStrength',
			type: '1f',
			value: 0,
		},
	};

	useCurtains(
		(curtains) => {
			const onMouseMove = (e) => {
				mouseLastPosition.current.copy(mousePosition.current);

				const mouse = new Vec2();

				if (e.targetTouches) {
					mouse.set(e.targetTouches[0].clientX, e.targetTouches[0].clientY);
				} else {
					mouse.set(e.clientX, e.clientY);
				}

				mousePosition.current.set(
					curtains.lerp(mousePosition.current.x, mouse.x, 0.3),
					curtains.lerp(mousePosition.current.y, mouse.y, 0.3)
				);

				if (mouseLastPosition.current.x && mouseLastPosition.current.y) {
					let delta = Math.sqrt(
						Math.pow(mouseLastPosition.current.x - mouseLastPosition.current.x, 2) +
							Math.pow(mousePosition.current.y - mouseLastPosition.current.y, 2) / 30
					);
					delta = Math.min(4, delta);

					if (delta >= deltas.current.max) {
						deltas.current.max = delta;
					}
				}

				if (plane) {
					plane.uniforms.mousePosition.value = plane.mouseToPlaneCoords(
						mousePosition.current
					);
				}
			};

			window.addEventListener('mousemove', onMouseMove);
			window.addEventListener('touchmove', onMouseMove, { passive: true });

			return () => {
				window.removeEventListener('mousemove', onMouseMove);
				window.removeEventListener('touchmove', onMouseMove, { passive: true });
			};
		},
		[plane]
	);

	const setResolution = (plane) => {
		const planeBBox = plane.getBoundingRect();
		plane.uniforms.resolution.value = [planeBBox.width, planeBBox.height];
	};

	const onReady = (plane) => {
		plane.setPerspective(35);

		deltas.current.max = 2;

		setResolution(plane);

		setPlane(plane);
		onReadyCallBack();
	};

	const onRender = (plane) => {
		plane.uniforms.time.value++;

		deltas.current.applied +=
			(deltas.current.max - deltas.current.applied) * 0.02;
		deltas.current.max += (0 - deltas.current.max) * 0.01;

		plane.uniforms.mouseMoveStrength.value = deltas.current.applied;
	};

	const onAfterResize = (plane) => {
		setResolution(plane);
	};

	return (
		<Plane
			className="logoPlane"
			vertexShader={vertexShader}
			fragmentShader={fragmentShader}
			widthSegments={20}
			heightSegments={20}
			uniforms={uniforms}
			onReady={onReady}
			onRender={onRender}
			onAfterResize={onAfterResize}
			watchScroll={false}
		>
			<img
				src={logoMain}
				alt="logo"
				data-sampler="simplePlaneTexture"
				ref={resetRef}
			/>
		</Plane>
	);
};

export default LogoHolder;
