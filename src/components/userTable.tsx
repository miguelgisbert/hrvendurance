import { useState, useEffect } from 'react'
import { DataGrid, GridCellParams, GridColDef, GridRowModel } from '@mui/x-data-grid'
import { Grid} from '@mui/material'
import Chip from '@mui/material/Chip'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import { styled } from '@mui/material/styles'

interface UserTableProps {
    translations: {
      [key: string]: string
    }
}

interface RowData {
    id: number
    Day: { day: string, date: string }
    hr?: number | null
    RMSSD?: number | null
    MRMSSD?: number | null
    lnRMSSD?: number | null
    MlnRMSSD?: number | null
    Suggestion: string
}

const StyledDataGrid = styled(DataGrid)(() => ({
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'transparent'
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
        justifyContent: 'center'
    },
    '& .MuiDataGrid-cell': {
        backgroundColor: 'transparent',
        textAlign: 'center',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '10px 0',
        whiteSpace: 'normal',
        wordWrap: 'break-word'
    },
    '--DataGrid-containerBackground': 'transparent',
    '--DataGrid-pinnedBackground': 'transparent',
}))

export default function UserTable({translations}: UserTableProps) {

    // Data grid
    const columns: GridColDef[] = [
        {
        field: 'Day',
        headerName: translations.Day,
        width: 150,
        sortable: false,
        headerClassName: 'header-transparent',
        renderCell: (params: GridCellParams) => {
            const value = params.value as { day: string, date: string }
            return (
                <div>
                    <div>{value.day}</div>
                    <div>{value.date}</div>
                </div>  
            )
            },
        },
        {
        field: 'hr',
        headerName: 'HR',
        type: 'number',
        width: 80,
        editable: true,
        sortable: false,
        headerClassName: 'header-transparent',
        },
        {
        field: 'RMSSD',
        headerName: 'RMSSD',
        type: 'number',
        width: 120,
        editable: true,
        sortable: false,
        headerClassName: 'header-transparent',
        },
        {
        field: 'lnRMSSD',
        headerName: 'lnRMSSD',
        type: 'number',
        width: 120,
        sortable: false,
        headerClassName: 'header-transparent',
        },
        {
        field: 'Suggestion',
        headerName: translations.Suggestion,
        width: 180,
        sortable: false,
        headerClassName: 'header-transparent',
        renderCell: (params: GridCellParams) => {
            const { color, Icon } = getChipProps(params.value as string)
            return (
            <Chip icon={<Icon sx={{ color: `${color} !important` }} />} label={params.value as string} variant="outlined" sx={{ width:150, color: color, borderColor: color }} />
            )
        },
        },
    ]

    const generateRows = (): RowData[] => [
        // { id: 1, Day: { day: translations.Monday,      date: '14/01/2025' },     hr: 68, RMSSD: 46, MRMSSD: 50, lnRMSSD: 3.83, MlnRMSSD: 3.92, Suggestion: translations.Rest },
        // { id: 2, Day: { day: translations.Tuesday,     date: '15/01/2025' },     hr: 67, RMSSD: 49, MRMSSD: 50, lnRMSSD: 3.89, MlnRMSSD: 3.91, Suggestion: translations.LowIntensity },
        // { id: 3, Day: { day: translations.Wednesday,   date: '16/01/2025' },     hr: 66, RMSSD: 53, MRMSSD: 50, lnRMSSD: 3.97, MlnRMSSD: 3.91, Suggestion: translations.HighIntensity },
        { id: 4, Day: { day: translations.Thursday,    date: '17/01/2025' },     hr: 65, RMSSD: 46, MRMSSD: 49, lnRMSSD: 3.83, MlnRMSSD: 3.88, Suggestion: translations.HighIntensity },
        { id: 5, Day: { day: translations.Friday,      date: '18/01/2025' },     hr: 69, RMSSD: 50, MRMSSD: 50, lnRMSSD: 3.91, MlnRMSSD: 3.90, Suggestion: translations.HighIntensity },
    ]

    const [rows, setRows] = useState(generateRows())


    const processRowUpdate = (newRow: GridRowModel, oldRow: GridRowModel) => {
        if (newRow.RMSSD !== oldRow.RMSSD) {
            newRow.lnRMSSD = newRow.RMSSD ? parseFloat(Math.log(newRow.RMSSD).toFixed(2)) : undefined
          
            const recentRows = rows.slice(-4).map(row => row.RMSSD).filter(value => value !== undefined) as number[];
            const averageRMSSD = recentRows.length > 0 ? recentRows.reduce((a, b) => a + b, 0) / recentRows.length : null;
            
            console.log("averageRMSSD", averageRMSSD)
            console.log("recentRows", recentRows)
            if (!averageRMSSD) {
                newRow.Suggestion = translations.LowIntensity;
            } else if (newRow.RMSSD > averageRMSSD) {
                const lastTwoSuggestions = [
                    rows[rows.length - 3]?.Suggestion,
                    rows[rows.length - 2]?.Suggestion,
                ];
                console.log("lastTwoSuggestions", lastTwoSuggestions)
                if (lastTwoSuggestions.every(suggestion => suggestion === translations.HighIntensity)) {
                    newRow.Suggestion = translations.LowIntensity;
                } else {
                    newRow.Suggestion = translations.HighIntensity;
                }
            } else if (newRow.RMSSD === averageRMSSD) {
                newRow.Suggestion = translations.LowIntensity;
            } else {
                const previousSuggestion = rows[rows.length - 1]?.Suggestion;
                if (previousSuggestion === translations.Rest) {
                    newRow.Suggestion = translations.LowIntensity;
                } else {
                    newRow.Suggestion = translations.Rest;
                }
            }
        }
        return newRow
    }

    const today = new Date()
    const todayFormatted = `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`

    const addNewRow = () => {
        const rowExists = rows.some(row => row.Day.date === todayFormatted)
        if (!rowExists) {
            const newRow: RowData = {
            id: rows.length + 1,
            Day: { day: translations.Saturday, date: todayFormatted },
            hr: undefined,
            RMSSD: undefined,
            lnRMSSD: undefined,
            Suggestion: '',
            }
            setRows([...rows, newRow])
        }
    }
    
      useEffect(() => {
        addNewRow()
      }, [])

    const getChipProps = (label: string) => {
        switch (label) {
        case translations.Rest:
            return { color: '#a05555', Icon: SelfImprovementIcon }
        case translations.LowIntensity:
            return { color: '#b6970f', Icon: DirectionsWalkIcon }
        case translations.HighIntensity:
            return { color: '#4b7c2f', Icon: DirectionsRunIcon }
        default:
            return { color: 'default', Icon: SelfImprovementIcon }
        }
    }

    return (
        <Grid container alignItems="center" marginTop = {window.innerWidth < 650 ? "none" : "120px"} justifyContent={window.innerWidth < 950 ? "flex-start" : "center"} padding="70px 20px 130px" sx={{ overflowX: "auto" }}>
            <StyledDataGrid  
                rows={rows} 
                columns={columns}
                hideFooter
                getRowHeight={() => 'auto'}
                processRowUpdate={processRowUpdate}
                /*components={{
                    root: {
                        style: {
                            '--DataGrid-containerBackground': 'transparent',
                            '--DataGrid-pinnedBackground': 'transparent',
                        }
                    }
                }}*/
                sx={{
                    maxWidth: 1000,
                    height: 526,
                }}
            />
        </Grid>
    )
}