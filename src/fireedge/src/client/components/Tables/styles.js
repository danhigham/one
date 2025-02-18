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
import makeStyles from '@mui/styles/makeStyles'

export const rowStyles = makeStyles(
  ({ palette, typography, breakpoints, shadows }) => ({
    root: {
      padding: '0.8em',
      color: palette.text.primary,
      backgroundColor: palette.background.paper,
      fontWeight: typography.fontWeightRegular,
      fontSize: '1em',
      borderRadius: 6,
      display: 'flex',
      gap: 8,
      boxShadow: shadows[1],
      [breakpoints.down('md')]: {
        flexWrap: 'wrap'
      }
    },
    figure: {
      flexBasis: '20%',
      paddingTop: '12.5%',
      overflow: 'hidden',
      position: 'relative'
    },
    image: {
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'contain',
      position: 'absolute',
      userSelect: 'none'
    },
    main: {
      flex: 'auto',
      overflow: 'hidden',
      alignSelf: 'start'
    },
    title: {
      color: palette.text.primary,
      display: 'flex',
      gap: 6,
      alignItems: 'center',
      flexWrap: 'wrap',
      marginBottom: 8
    },
    labels: {
      display: 'inline-flex',
      gap: 6
    },
    caption: {
      ...typography.caption,
      color: palette.text.secondary,
      marginTop: 4,
      display: 'flex',
      gap: '0.5em',
      flexWrap: 'wrap',
      wordWrap: 'break-word',
      '& > .full-width': {
        flexBasis: '100%'
      }
    },
    secondary: {
      width: '25%',
      flexShrink: 0,
      whiteSpace: 'nowrap',
      textAlign: 'right',
      [breakpoints.down('sm')]: {
        display: 'none'
      },
      '& > *': {
        flexShrink: 0,
        whiteSpace: 'nowrap'
      }
    },
    actions: {
      flexShrink: 0
    }
  })
)
