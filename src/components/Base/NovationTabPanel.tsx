interface TabPanelProps {
    children?: React.ReactNode;
    index: string;
    value: string;
}

const TabPanel: React.FC<TabPanelProps> = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div role="tabpanel" hidden={value !== index} id={`tab-${index}`} aria-labelledby={`tab-${index}`} {...other}>
            {value === index && children}
        </div>
    );
};

export default TabPanel;
