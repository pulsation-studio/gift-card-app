import { computeSingleInstanceActionPath } from '#admin/helpers'
import {
  ActionBehavior,
  ActionButton,
  AdminProps,
  ResourceField,
  ResourceProps,
} from '#admin/models'
import { isStringDateTime } from '#helpers/is_string_date_time'
import { SharedProps } from '@adonisjs/inertia/types'
import { LucidModel, ModelObject } from '@adonisjs/lucid/types/model'
import { Button, Group, Pagination, ScrollArea, Table, Text } from '@mantine/core'
import { DateTime } from 'luxon'
import React, { ReactNode } from 'react'
import { HeadlessActionButton } from './headless_button.js'
import { RegularActionButton } from './regular_button.js'

export default function ResourceTable(props: AdminProps & ResourceProps<LucidModel> & SharedProps) {
  const isValidReactNode = (value: unknown): value is ReactNode => {
    return (
      value !== null &&
      value !== undefined &&
      (typeof value === 'string' || typeof value === 'number' || React.isValidElement(value))
    )
  }

  const formatterMap: Record<string, (value: any) => ReactNode> = {
    currencyFormatter: (value: string | number) => `${value} €`,
  }

  function getNestedValue(obj: any, path: string): unknown {
    return path.split('.').reduce((current, key) => (current ? current[key] : undefined), obj)
  }

  const renderCellValue = <Model extends LucidModel>(
    item: ModelObject,
    column: ResourceField<Model>
  ): ReactNode => {
    let value: unknown = getNestedValue(item, column.valueKey) || undefined

    if (column.dateFormat !== undefined && isStringDateTime(value))
      value = DateTime.fromISO(value).toFormat(column.dateFormat)

    if (column.enumLabels !== undefined && typeof value === 'string')
      value = column.enumLabels[value]

    if (column.wrapBy !== undefined && column.wrapBy in formatterMap)
      value = formatterMap[column.wrapBy](value)

    if (typeof value === 'string' && column.longField)
      return (
        <Text
          size="sm"
          truncate={column.truncate ?? 'end'}
          ta="left"
          maw={column.longField ? '15vw' : undefined}
        >
          {value}
        </Text>
      )

    if (isValidReactNode(value)) return value

    return ''
  }

  return (
    <>
      <ScrollArea>
        <Table
          horizontalSpacing="md"
          verticalSpacing="sm"
          striped
          withTableBorder
          highlightOnHover
          variant="light"
        >
          <Table.Thead>
            <Table.Tr>
              {props.tableProps.columns.map((column, index) => (
                <Table.Th key={index}>
                  {!column.onHeaderClick ? (
                    <Text>{column.headerLabel}</Text>
                  ) : (
                    <Button variant="subtle" onClick={column.onHeaderClick}>
                      {column.headerLabel}
                    </Button>
                  )}
                </Table.Th>
              ))}
              <Table.Th key="actions">
                <Text>Actions</Text>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {props.tableProps.items.map((item, itemIndex) => (
              <Table.Tr key={itemIndex}>
                {props.tableProps.columns.map((column, columnIndex) => (
                  <Table.Td key={columnIndex}>{renderCellValue(item, column)}</Table.Td>
                ))}
                <Table.Td key={props.tableProps.columns.length}>
                  <Group gap="xs">
                    {props.tableProps.singleInstanceActionButtons.map((action, actionIndex) =>
                      action.behavior === ActionBehavior.Headless ? (
                        <HeadlessActionButton
                          key={actionIndex}
                          action={action as ActionButton<LucidModel, ActionBehavior.Headless>}
                          submitPath={computeSingleInstanceActionPath(
                            action,
                            item,
                            props.resource.path
                          )}
                        />
                      ) : (
                        <RegularActionButton
                          action={action as ActionButton<LucidModel, ActionBehavior.Regular>}
                          key={actionIndex}
                          actionPath={computeSingleInstanceActionPath(
                            action,
                            item,
                            props.resource.path
                          )}
                        />
                      )
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </ScrollArea>

      {props.tableProps.pagination && (
        <Pagination
          onChange={() => {}}
          total={props.tableProps.pagination.nbrPage}
          defaultValue={props.tableProps.pagination.currentPage}
        />
      )}
    </>
  )
}
