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
/* eslint-disable jsdoc/require-jsdoc */
import * as yup from 'yup'
import { getValidationFromFields, schemaUserInput } from 'client/utils'

export const FORM_FIELDS = inputs =>
  inputs?.map(({
    name,
    description,
    type,
    default: defaultValue,
    min_value: min,
    max_value: max,
    options
  }) => {
    const optionsValue = options ?? `${min}..${max}`

    return {
      name,
      label: `${description ?? name} *`,
      ...schemaUserInput({
        mandatory: true,
        name,
        type,
        options: optionsValue,
        default: defaultValue
      })
    }
  })

export const STEP_FORM_SCHEMA = inputs => yup.object(
  getValidationFromFields(FORM_FIELDS(inputs))
)
