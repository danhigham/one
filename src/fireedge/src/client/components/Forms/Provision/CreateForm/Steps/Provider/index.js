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
import { useCallback, useMemo } from 'react'
import { useWatch } from 'react-hook-form'

import { useListForm } from 'client/hooks'
import { useAuth } from 'client/features/Auth'
import { useProvider, useProvisionTemplate } from 'client/features/One'
import { ListCards } from 'client/components/List'
import { EmptyCard, ProvisionCard } from 'client/components/Cards'
import { getProvisionTypeFromTemplate } from 'client/models/ProvisionTemplate'
import { T } from 'client/constants'

import { STEP_ID as INPUTS_ID } from 'client/components/Forms/Provision/CreateForm/Steps/Inputs'
import { STEP_ID as TEMPLATE_ID } from 'client/components/Forms/Provision/CreateForm/Steps/Template'
import { STEP_FORM_SCHEMA } from 'client/components/Forms/Provision/CreateForm/Steps/Provider/schema'

export const STEP_ID = 'provider'

const Provider = () => ({
  id: STEP_ID,
  label: T.Provider,
  resolver: () => STEP_FORM_SCHEMA,
  content: useCallback(({ data, setFormData }) => {
    const providers = useProvider()
    const provisionTemplates = useProvisionTemplate()
    const { providerConfig } = useAuth()

    const provisionTemplateSelected = useWatch({ name: TEMPLATE_ID })?.[0] ?? {}

    const providersAvailable = useMemo(() => {
      const templateProvisionType =
        getProvisionTypeFromTemplate(provisionTemplates, provisionTemplateSelected)

      return providers.filter(provider => {
        const { TEMPLATE: { PLAIN = {} } } = provider ?? {}
        const provisionType = [providerConfig[PLAIN.provider]?.provision_type ?? []].flat()

        return PLAIN.provider === provisionTemplateSelected.provider &&
          provisionType.includes(templateProvisionType)
      })
    }, [])

    const {
      handleSelect,
      handleClear
    } = useListForm({ key: STEP_ID, setList: setFormData })

    const handleClick = (provider, isSelected) => {
      // reset inputs when selected provider changes
      setFormData(prev => ({ ...prev, [INPUTS_ID]: undefined }))

      isSelected ? handleClear() : handleSelect(provider)
    }

    return (
      <ListCards
        list={providersAvailable}
        EmptyComponent={<EmptyCard title={'Your providers list is empty'} />}
        CardComponent={ProvisionCard}
        gridProps={{ 'data-cy': 'providers' }}
        cardsProps={({ value = {} }) => {
          const { ID, TEMPLATE } = value
          const isSelected = data?.some(selected => selected.ID === ID)
          const image = providerConfig?.[TEMPLATE?.PLAIN?.provider]?.image

          return {
            image,
            isProvider: true,
            isSelected,
            handleClick: () => handleClick(value, isSelected)
          }
        }}
      />
    )
  }, [])
})

export default Provider
