/* ------------------------------------------------------------------------- *
 * Copyright 2002-2021, OpenNebula Project, OpenNebula Systems               *
 *                                                                           *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may   *
 * not use this file except in compliance with the License. You may obtain   *
 * a copy of the License at                                                  *
 *                                                                           *
 * http://www.apache.org/licenses/LICENSE-2.0                                *
 *                                                                           *
 * Unless required by applicable law or agreed to in writing, software       *
 * distributed under the License is distributed on an "AS IS" BASIS,         *
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  *
 * See the License for the specific language governing permissions and       *
 * limitations under the License.                                            *
 * ------------------------------------------------------------------------- */
import { useMemo, SetStateAction, JSXElementConstructor } from 'react'
import { string, func, shape, object } from 'prop-types'

import { useForm, Controller } from 'react-hook-form'
import { TextField, Grid, Typography, FormControlLabel, Checkbox, Autocomplete, Chip } from '@mui/material'

import { SubmitButton } from 'client/components/FormControl'
import { RestClient, requestConfig } from 'client/utils'

/**
 * @param {object} props - Component props
 * @param {SetStateAction} props.handleChangeResponse - Change after
 * @param {object} props.command - Resource command action
 * @param {string} props.command.name - Name of command
 * @param {('GET'|'POST'|'DELETE'|'PUT')} props.command.httpMethod - Http method
 * @param {object} props.command.params - Parameters for the action
 * @returns {JSXElementConstructor} Form with command parameters
 */
const ResponseForm = ({
  handleChangeResponse,
  command: { name, httpMethod, params }
}) => {
  const { control, handleSubmit, errors, formState } = useForm()
  const memoParams = useMemo(() => Object.entries(params), [name])

  const onSubmit = async dataForm => {
    try {
      const config = requestConfig(dataForm, { name, httpMethod, params })

      const { id, ...res } = await RestClient.request(config) ?? {}
      handleChangeResponse(JSON.stringify(res, null, '\t'))
    } catch (err) {
      handleChangeResponse(JSON.stringify(err.data, null, '\t'))
      console.log('ERROR', err)
    }
  }

  return (
    <>
      <Typography
        color='textPrimary'
        component='h2'
        variant='h2'
        style={{ padding: '16px 0' }}
      >
        {name || 'Request'}
      </Typography>
      <Grid
        container
        spacing={1}
        justifyContent='flex-start'
        component='form'
        onSubmit={handleSubmit(onSubmit)}
        autoComplete='off'
      >
        {memoParams?.map(([nameParam, { default: defaultValue }]) => (
          <Grid item xs={12} key={`param-${nameParam}`}>
            <Controller
              render={({ value, onChange, ...controllerProps }) => ({
                boolean: <FormControlLabel
                  control={(
                    <Checkbox
                      color='primary'
                      onChange={e => onChange(e.target.checked)}
                    />
                  )}
                  label={nameParam}
                  labelPlacement='end'
                />,
                object: <Autocomplete
                  fullWidth
                  multiple
                  color='secondary'
                  freeSolo
                  options={[]}
                  onChange={(_, newValue) => onChange(newValue ?? '')}
                  renderTags={(tags, getTagProps) =>
                    tags.map((tag, index) => (
                      <Chip
                        key={`${index}-${tag}`}
                        variant='outlined'
                        label={tag}
                        {...getTagProps({ index })}
                      />
                    ))
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      fullWidth
                      label={nameParam}
                      color='secondary'
                      error={Boolean(errors[name])}
                      helperText={errors[name]?.message}
                    />
                  )}
                />
              }[typeof defaultValue] ?? (
                <TextField
                  error={Boolean(errors[name])}
                  helperText={errors[name]?.message}
                  fullWidth
                  value={value ?? ''}
                  label={nameParam}
                  color='secondary'
                  onChange={onChange}
                  {...controllerProps}
                />
              ))}
              control={control}
              name={`${nameParam}`}
              defaultValue={defaultValue}
            />
          </Grid>
        ))}
        <Grid item xs={12}>
          <SubmitButton
            color='secondary'
            isSubmitting={formState.isSubmitting}
          />
        </Grid>
      </Grid>
    </>
  )
}

ResponseForm.propTypes = {
  command: shape({
    name: string.isRequired,
    httpMethod: string.isRequired,
    params: object.isRequired
  }).isRequired,
  handleChangeResponse: func.isRequired
}

ResponseForm.defaultProps = {
  command: {
    name: '',
    httpMethod: 'GET',
    params: {}
  },
  handleChangeResponse: () => undefined
}
export default ResponseForm
