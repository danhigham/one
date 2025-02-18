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
import { boolean, string, object } from 'yup'

import { DatastoresTable } from 'client/components/Tables'
import { getValidationFromFields } from 'client/utils'
import { INPUT_TYPES } from 'client/constants'

const ENFORCE = {
  name: 'enforce',
  label: 'Enforce capacity checks',
  tooltip: `
    If it is set to true, the host capacity will be checked.
    This will only affect oneadmin requests, regular users
    resize requests will always be enforced.`,
  type: INPUT_TYPES.SWITCH,
  validation: boolean().default(() => false),
  grid: { md: 12 }
}

const DATASTORE = {
  name: 'datastore',
  label: 'Select the new datastore',
  type: INPUT_TYPES.TABLE,
  Table: DatastoresTable,
  validation: string()
    .trim()
    .notRequired()
    .default(() => undefined),
  grid: { md: 12 }
}

export const FIELDS = [ENFORCE, DATASTORE]

export const SCHEMA = object(getValidationFromFields(FIELDS))
