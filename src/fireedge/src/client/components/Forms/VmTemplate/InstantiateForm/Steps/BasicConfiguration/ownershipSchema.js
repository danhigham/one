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
import { string } from 'yup'

import { useGroup, useUser } from 'client/features/One'
import { INPUT_TYPES } from 'client/constants'

export const UID_FIELD = {
  name: 'AS_UID',
  label: 'Instantiate as different User',
  type: INPUT_TYPES.AUTOCOMPLETE,
  values: () => {
    const users = useUser()

    return users
      .map(({ ID: value, NAME: text }) => ({ text, value }))
      .sort((a, b) => a.value - b.value)
  },
  validation: string()
    .trim()
    .notRequired()
    .default(undefined),
  grid: { md: 12 }
}

export const GID_FIELD = {
  name: 'AS_GID',
  label: 'Instantiate as different Group',
  type: INPUT_TYPES.AUTOCOMPLETE,
  values: () => {
    const groups = useGroup()

    return groups
      .map(({ ID: value, NAME: text }) => ({ text, value }))
      .sort((a, b) => a.value - b.value)
  },
  validation: string()
    .trim()
    .notRequired()
    .default(undefined),
  grid: { md: 12 }
}

export const FIELDS = [
  UID_FIELD,
  GID_FIELD
]
