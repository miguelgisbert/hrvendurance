import { useState, useEffect, useContext } from 'react'
import { DataGrid, GridCellParams, GridColDef, GridRowModel, GridEventListener } from '@mui/x-data-grid'
import { colors, Grid, Typography } from '@mui/material'
import Chip from '@mui/material/Chip'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import { styled } from '@mui/material/styles'
import { db } from '../firebaseConfig'
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore'
import { UserContext } from '../UserContext'

interface UserTableProps {
    translations: {
        [key: string]: string
    }
}

interface RowData {
    id: number
    date: Date
    hr?: number | null
    RMSSD?: number | null
    lnRMSSD?: number | null
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
            wordWrap: 'break-word',
    },
    '& .editable-cell': {
        backgroundColor: '#e0f7fa',
        borderRadius: '4px',
        color: '#004d40',
        '& input': {
            color: '#004d40',
            caretColor: '#004d40',
        },
        '&:focus': {
            outline: 'none',
            border: '1px solid #1976d2', // Blue border when cell is focused
        }
    },
    '--DataGrid-containerBackground': 'transparent',
    '--DataGrid-pinnedBackground': 'transparent',
}))

export default function UserTable({ translations }: UserTableProps) {

    // Data grid
    const columns: GridColDef[] = [
        {
            field: 'date',
            headerName: translations.Day,
            width: 150,
            sortable: false,
            headerClassName: 'header-transparent',
            renderCell: (params: GridCellParams) => {
                if (!params.value) {
                    return <div>Invalid Date</div>
                }
                const date = new Date(params.value as string)
                if (isNaN(date.getTime())) {
                    return <div>Invalid Date</div>
                }
                const day = date.toLocaleDateString('en-US', { weekday: 'long' })
                const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`
                return (
                    <div>
                        <div>{translations[day]}</div>
                        <div>{formattedDate}</div>
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
            cellClassName: 'editable-cell',
        },
        {
            field: 'RMSSD',
            headerName: 'RMSSD',
            type: 'number',
            width: 120,
            editable: true,
            sortable: false,
            headerClassName: 'header-transparent',
            cellClassName: 'editable-cell',
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
                const suggestionKey = params.value as string;
                const { color, Icon } = getChipProps(params.value as string)
                return (
                    <Chip icon={<Icon sx={{ color: `${color} !important` }} />} label={translations[suggestionKey]} variant="outlined" sx={{ width: 150, color: color, borderColor: color }} />
                )
            },
        },
    ]
    
    const { user } = useContext(UserContext)
    const [rows, setRows] = useState<RowData[]>([])
    const today = new Date()
    const todayFormatted = `${today.getFullYear()}-${(today.getMonth() + 1).toString().padStart(2, '0')}-${today.getDate().toString().padStart(2, '0')}`
    
    const fetchRows = async () => {
        if (user) {
            const q = query(collection(db, 'hrv-logs'), where('uid', '==', user.uid))
            const querySnapshot = await getDocs(q)
            const fetchedRows: RowData[] = querySnapshot.docs.map((doc, index) => {
                const data = doc.data()
                const date = new Date(data.date)
                return {
                    id: index + 1,
                    date: date,
                    hr: data.hr,
                    RMSSD: data.RMSSD,
                    lnRMSSD: data.lnRMSSD,
                    Suggestion: data.Suggestion,
                }
            })
            
            const rowExists = fetchedRows.some(row => row.date && row.date.toISOString().split('T')[0] === todayFormatted)

            if (!rowExists) {
                const newRow: RowData = {
                    id: rows.length + 1,
                    date: new Date(todayFormatted),
                    hr: null,
                    RMSSD: null,
                    lnRMSSD: null,
                    Suggestion: '',
                }
                setRows([...fetchedRows, newRow])
            } else {
                setRows(fetchedRows)
                console.log('Row for today already exists');
            }
        }
    }

    useEffect(() => {
            fetchRows()
    }, [user])

    const processRowUpdate = async (newRow: GridRowModel, oldRow: GridRowModel) => {
        if (newRow.RMSSD !== oldRow.RMSSD) {
            newRow.lnRMSSD = newRow.RMSSD ? parseFloat(Math.log(newRow.RMSSD).toFixed(2)) : undefined

            const currentIndex = rows.findIndex(row => row.id === newRow.id)
            const recentRows = rows.slice(Math.max(currentIndex - 4, 0), currentIndex).map(row => row.RMSSD).filter(value => value !== undefined) as number[]
            const averageRMSSD = recentRows.length > 0 ? recentRows.reduce((a, b) => a + b, 0) / recentRows.length : null;
            const lastTwoSuggestions = [
                rows[rows.length - 3]?.Suggestion,
                rows[rows.length - 2]?.Suggestion,
            ];

            console.log('lastTwoSuggestions: ', lastTwoSuggestions)
            console.log('averageRMSSD: ', averageRMSSD)

            if (!averageRMSSD) {
                newRow.Suggestion = 'LowIntensity';
            } else if (newRow.RMSSD >= averageRMSSD) {
                if (lastTwoSuggestions.every(suggestion => suggestion === 'HighIntensity')) {
                    newRow.Suggestion = 'LowIntensity'
                } else {
                    newRow.Suggestion = 'HighIntensity'
                }
            } else {
                if (lastTwoSuggestions[1] === 'LowIntensity') {
                    newRow.Suggestion = 'Rest'
                } else {
                    newRow.Suggestion = 'LowIntensity'
                }
            }
            if (user) {
                try {
                    const userDocRef = doc(db, 'hrv-logs', `${user.uid}_${todayFormatted.replace(/\//g, '-')}`)
                    const rowData = {
                        uid: user.uid,
                        date: new Date(todayFormatted).toISOString(),
                        hr: newRow.hr ?? null,
                        RMSSD: newRow.RMSSD ?? null,
                        lnRMSSD: newRow.lnRMSSD ?? null,
                        Suggestion: newRow.Suggestion ?? '',
                    };
                    await setDoc(userDocRef, rowData, { merge: true });
                    console.log('Document successfully updated!')
                } catch (error) {
                    console.error('Error updating document: ', error)
                }
            } else {
                console.error('No user is logged in')
            }
        }
        return newRow
    }

    const getChipProps = (label: string) => {
        switch (label) {
            case 'Rest':
                return { color: '#a05555', Icon: SelfImprovementIcon }
            case 'LowIntensity':
                return { color: '#b6970f', Icon: DirectionsWalkIcon }
            case 'HighIntensity':
                return { color: '#4b7c2f', Icon: DirectionsRunIcon }
            default:
                return { color: 'default', Icon: SelfImprovementIcon }
        }
    }

    return (
        <Grid container flexDirection={"column"} alignItems="center" marginTop={window.innerWidth < 650 ? "none" : "120px"} justifyContent={window.innerWidth < 950 ? "flex-start" : "center"} padding="70px 20px 130px" sx={{ overflowX: "auto" }}>
            <Typography  sx={{ color: colors.grey[800], textAlign: 'center', marginTop: '50px' }}>{translations.first_instructions}</Typography>
            <StyledDataGrid
                rows={rows}
                columns={columns}
                hideFooter
                getRowHeight={() => 'auto'}
                processRowUpdate={processRowUpdate}
                disableRowSelectionOnClick
                editMode="cell"
                sx={{
                    maxWidth: 1000,
                    height: 526,
                }}
                />
        </Grid>
    )
}