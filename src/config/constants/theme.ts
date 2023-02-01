import { ThemeOptions } from '@mui/material';

export const light: ThemeOptions = {};

export const dark: ThemeOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#00ACFD'
        },
        secondary: {
            main: '#313cad'
        },
        background: {
            paper: '#0e1031',
            default: '#070c38'
        },
        success: {
            main: '#44FF8F'
        },
        text: {
            secondary: 'rgba(0, 172, 253, 0.5)'
        }
    },
    typography: {
        fontFamily: "'Chakra Petch', cursive",
        fontSize: 14
    },
    shape: {
        borderRadius: 5
    },
    components: {
        MuiIconButton: {
            styleOverrides: {
                root: {
                    borderRadius: 5
                }
            }
        },
        MuiInputAdornment: {
            styleOverrides: {
                root: {
                    marginTop: '0px !important',
                    marginBottom: 0,
                    marginLeft: 20,
                    marginRight: 8
                }
            }
        },
        MuiInputBase: {
            styleOverrides: {
                root: {
                    height: 'unset'
                }
            }
        },
        MuiButton: {
            styleOverrides: {
                outlined: {
                    borderWidth: '2px !important'
                }
            }
        },
        MuiFilledInput: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(0, 172, 253, 0.1)',
                    borderRadius: 5,
                    '&:before': {
                        content: 'none'
                    },
                    '&:after': {
                        content: 'none'
                    }
                }
            }
        },
        MuiCardContent: {
            styleOverrides: {
                root: {
                    padding: '20px !important'
                }
            }
        },
        MuiDialog: {
            styleOverrides: {
                paper: {
                    backgroundColor: '#000000',
                    fontSize: 16,
                    padding: '8px 12px',
                    borderRadius: 5,
                    border: '1px solid #00ACFD',
                    backgroundImage: 'none'
                }
            }
        },
        MuiPaper: {
            styleOverrides: {
                outlined: {
                    border: '2px solid #00ACFD',
                    backgroundColor: 'rgba(0, 172, 253, 0.05)',
                    boxShadow:
                        'inset 0px 0px 7.32115px rgba(168, 252, 255, 0.5), inset 0px -20px 20px -49.2654px rgba(0, 172, 253, 0.15), inset 0px 20px 50px -36.9491px rgba(0, 172, 253, 0.25)',
                    backdropFilter: 'blur(5px)',
                    borderRadius: 5
                }
            }
        },
        MuiTab: {
            styleOverrides: {
                root: {
                    textTransform: 'capitalize',
                    fontSize: 16,
                    fontWeight: 500,
                    lineHeight: '16px',
                    whiteSpace: 'nowrap',
                    flexGrow: 1,
                    flexBasis: 'unset',
                    paddingTop: 20,
                    paddingLeft: 0,
                    paddingRight: 0,
                    paddingBottom: 20,
                    minWidth: 0
                }
            }
        },
        MuiSlider: {
            styleOverrides: {
                valueLabel: {
                    padding: '4px 10px',
                    backgroundColor: '#000000',
                    fontSize: 16,
                    borderRadius: 5,
                    border: '1px solid #00ACFD',
                    '&::before': {
                        borderBottom: '1px solid #00ACFD',
                        borderRight: '1px solid #00ACFD'
                    }
                }
            }
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    backgroundColor: '#000000',
                    fontSize: 16,
                    padding: '8px 12px',
                    borderRadius: 5,
                    border: '1px solid #00ACFD'
                },
                arrow: {
                    color: '#00ACFD'
                }
            }
        },
        MuiMenu: {
            styleOverrides: {
                paper: {
                    borderTop: '1px solid rgba(0, 172, 253, 0.2)',
                    backgroundColor: 'rgba(0, 172, 253, 0.1) !important',
                    backgroundImage: 'none !important',
                    backdropFilter: 'blur(10px) !important',
                    borderRadius: '5px !important',
                    '& .Mui-selected': {
                        color: '#00ACFD !important'
                    }
                }
            }
        },
        MuiAccordion: {
            styleOverrides: {
                root: {
                    backgroundColor: 'transparent',
                    '&:before': {
                        display: 'none'
                    }
                }
            }
        }
    }
};
