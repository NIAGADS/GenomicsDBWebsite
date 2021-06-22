// modified from https://github.com/ggascoigne/react-table-example

import { Button, Popover, Typography, createStyles, makeStyles } from '@material-ui/core'
import React, { FormEvent, ReactElement, useCallback } from 'react'
import { TableInstance } from 'react-table'

const useStyles = makeStyles(
  createStyles({
    columnsPopOver: {
      padding: 24,
    },
    filtersResetButton: {
      position: 'absolute',
      top: 18,
      right: 21,
    },
    popoverTitle: {
      fontWeight: 500,
      padding: '0 24px 24px 0',
      textTransform: 'uppercase',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(2, 218px)',
      '@media (max-width: 600px)': {
        gridTemplateColumns: 'repeat(1, 180px)',
      },
      gridColumnGap: 24,
      gridRowGap: 24,
    },
    cell: {
      width: '100%',
      display: 'inline-flex',
      flexDirection: 'column',
    },
    hidden: {
      display: 'none',
    },
  })
)

type FilterPageProps = {
  instance: TableInstance
  anchorEl?: Element
  onClose: () => void
  show: boolean
}

function FilterMenu({
  instance,
  anchorEl,
  onClose,
  show,
}: FilterPageProps): ReactElement {
  const classes = useStyles({})
  //@ts-ignore
  const { allColumns, setAllFilters } = instance

  const onSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      onClose()
    },
    [onClose]
  )

  const resetFilters = useCallback(() => {
    setAllFilters([])
  }, [setAllFilters])

  return (
    <div>
      <Popover
        anchorEl={anchorEl}
        id={'popover-filters'}
        onClose={onClose}
        open={show}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <div className={classes.columnsPopOver}>
          <Typography className={classes.popoverTitle}>Filters</Typography>
          <form onSubmit={onSubmit}>
            <Button className={classes.filtersResetButton} color='primary' onClick={resetFilters}>
              Reset
            </Button>
            <div className={classes.grid}>
              {allColumns
                //@ts-ignore
                .filter((item) => item.canFilter)
                .map((column) => (
                  <div key={column.id} className={classes.cell}>
                    {column.render('Filter')}
                  </div>
                ))}
            </div>
            <Button className={classes.hidden} type={'submit'}>
              &nbsp;
            </Button>
          </form>
        </div>
      </Popover>
    </div>
  )
}

export default FilterMenu;