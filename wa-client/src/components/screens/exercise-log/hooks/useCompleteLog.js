import { useMutation } from '@tanstack/react-query'
import { useNavigate, useParams } from 'react-router-dom'

import ExerciseLogService from '../../../../services/exercise/exercise-log.service'

export const useCompleteLog = () => {
	const { id } = useParams()

	const navigate = useNavigate()

	const { mutate, error: errorCompleted } = useMutation(
		['complete log'],
		body => ExerciseLogService.complete(id, body),
		{
			onSuccess: ({ data }) => {
				navigate(`/workout/${data.workoutLogId}`)
			}
		}
	)

	return { completeLog: mutate, errorCompleted }
}
