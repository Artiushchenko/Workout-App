import styles from '../detail/Workout.module.scss'

const WorkoutItem = ({ workout, mutate, deleteIcon }) => {
	return (
		<div className={styles.item}>
			<button
				aria-label='Create new workout'
				onClick={() => mutate(workout.id)}
			>
				<span>{workout.name}</span>
				<span style={{ color: 'red' }}>{deleteIcon}</span>
			</button>
		</div>
	)
}

export default WorkoutItem
