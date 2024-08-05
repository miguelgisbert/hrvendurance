import { DataGrid, GridCellParams, GridColDef } from '@mui/x-data-grid'
import Chip from '@mui/material/Chip'
import SelfImprovementIcon from '@mui/icons-material/SelfImprovement'
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun'
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk'
import { styled } from '@mui/material/styles'

interface TrainingTableProps {
    translations: {
      [key: string]: string;
    };
}

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .MuiDataGrid-columnHeaders': {
        backgroundColor: 'transparent'
    },
    '& .MuiDataGrid-columnHeaderTitleContainer': {
        justifyContent: 'center'
    },
    '& .MuiDataGrid-cell': {
        backgroundColor: 'transparent',
        textAlign: 'center'
    },
    '--DataGrid-containerBackground': 'transparent',
    '--DataGrid-pinnedBackground': 'transparent',
}));

export default function TrainingTable({translations}: TrainingTableProps) {

    // Data grid
    const columns: GridColDef[] = [
        {
        field: 'Day',
        headerName: translations.Day,
        width: 150,
        sortable: false,
        headerClassName: 'header-transparent',
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
        field: 'MRMSSD',
        headerName: 'MRMSSD',
        type: 'number',
        width: 120,
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
        field: 'MlnRMSSD',
        headerName: 'MlnRMSSD',
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

    const generateRows = () => ([
        { id: 1, Day: translations.Monday,    hr: 68, RMSSD: 46, MRMSSD: 50, lnRMSSD: 3.83, MlnRMSSD: 3.92, Suggestion: translations.Rest },
        { id: 2, Day: translations.Tuesday,   hr: 67, RMSSD: 49, MRMSSD: 50, lnRMSSD: 3.89, MlnRMSSD: 3.91, Suggestion: translations.LowIntensity },
        { id: 3, Day: translations.Wednesday, hr: 66, RMSSD: 53, MRMSSD: 50, lnRMSSD: 3.97, MlnRMSSD: 3.91, Suggestion: translations.HighIntensity },
        { id: 4, Day: translations.Thursday,  hr: 65, RMSSD: 46, MRMSSD: 49, lnRMSSD: 3.83, MlnRMSSD: 3.88, Suggestion: translations.LowIntensity },
        { id: 5, Day: translations.Friday,    hr: 69, RMSSD: 50, MRMSSD: 50, lnRMSSD: 3.91, MlnRMSSD: 3.90, Suggestion: translations.HighIntensity },
        { id: 6, Day: translations.Saturday,  hr: 61, RMSSD: 52, MRMSSD: 50, lnRMSSD: 3.95, MlnRMSSD: 3.92, Suggestion: translations.HighIntensity },
        { id: 7, Day: translations.Sunday,    hr: 71, RMSSD: 47, MRMSSD: 49, lnRMSSD: 3.85, MlnRMSSD: 3.89, Suggestion: translations.LowIntensity },
        { id: 8, Day: translations.Monday,    hr: 64, RMSSD: 49, MRMSSD: 50, lnRMSSD: 3.89, MlnRMSSD: 3.90, Suggestion: translations.Rest },
        { id: 9, Day: translations.Tuesday,   hr: 60, RMSSD: 46, MRMSSD: 49, lnRMSSD: 3.83, MlnRMSSD: 3.88, Suggestion: translations.LowIntensity },
    ])
    
    const rows = generateRows()
    const getChipProps = (label: string) => {
        switch (label) {
        case translations.Rest:
            return { color: '#a05555', Icon: SelfImprovementIcon };
        case translations.LowIntensity:
            return { color: '#b6970f', Icon: DirectionsWalkIcon };
        case translations.HighIntensity:
            return { color: '#4b7c2f', Icon: DirectionsRunIcon };
        default:
            return { color: 'default', Icon: SelfImprovementIcon };
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center' }}>
            <StyledDataGrid  
                rows={rows} 
                columns={columns}
                hideFooter
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
                    height: 526
                }}
            />
        </div>
    );
}