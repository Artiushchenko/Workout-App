import { useProfile } from '../useProfile'

import styles from './Statistics.module.scss'

const Statistics = () => {
	const { data } = useProfile()

	return (
		<div className={styles.wrapper}>
			{data?.statistics?.map(statistic => (
				<div className={styles.count} key={statistic.label}>
					<div className={styles.heading}>{statistic.label}</div>
					<div className={styles.number}>{statistic.value}</div>
				</div>
			))}
		</div>
	)
}

export default Statistics
