import ViewContentWrapper from 'components/Launchpad/View/ViewContentWrapper';
import ViewHeader from 'components/Launchpad/View/ViewHeader';
import ViewPoolActions from 'components/Launchpad/View/ViewPoolActions';
import ViewPoolInfo from 'components/Launchpad/View/ViewPoolInfo';
import ViewWrapper from 'components/Launchpad/View/ViewWrapper';

const View = () => {
    return (
        <ViewWrapper>
            <ViewHeader />
            <ViewContentWrapper>
                <ViewPoolActions />
                <ViewPoolInfo />
            </ViewContentWrapper>
        </ViewWrapper>
    );
};

export default View;
