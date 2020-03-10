import * as React from 'react';
import { connect } from 'react-redux';
import { Justify, Icon, Table, Button, SearchBox } from '@tea/component';
import { t, Trans } from '@tencent/tea-app/lib/i18n';
import { bindActionCreators } from '@tencent/ff-redux';
import { router } from '../../../router';
import { allActions } from '../../../actions';
import { RootProps } from '../RoleApp';
import { GroupAssociateWorkflowDialog } from '../associate/GroupAssociateWorkflowDialog';
import { GroupFilter } from '../../../models';

const mapDispatchToProps = dispatch =>
  Object.assign({}, bindActionCreators({ actions: allActions }, dispatch), { dispatch });

@connect(state => state, mapDispatchToProps)
export class GroupActionPanel extends React.Component<RootProps, {}> {

  componentWillUnmount() {
    let { actions } = this.props;
    actions.group.associate.clearGroupAssociation();
  }

  componentDidMount() {
    const { actions, route, roleEditor } = this.props;
    /** 设置用户组关联场景 */
    let filter: GroupFilter = {
      resource: 'role',
      resourceID: route.queries['roleName'],
      /** 关联/解关联回调函数 */
      callback: () => {
        actions.role.detail.fetchRole({ name: route.queries['roleName'] });
      }
    };
    actions.group.associate.setupGroupFilter(filter);
    /** 拉取关联用户组列表，拉取后自动更新groupAssociation */
    actions.group.associate.groupAssociatedList.applyFilter(filter);
    /** 拉取用户组列表 */
    actions.group.associate.groupList.performSearch('');
  }

  render() {
    const { actions, route } = this.props;
    let urlParam = router.resolve(route);
    const { sub } = urlParam;

    return (
      <React.Fragment>
        <Table.ActionPanel>
          <Justify
            left={
              <Button type="primary" onClick={e => {
                /** 开始关联用户组工作流 */
                actions.group.associate.associateGroupWorkflow.start();
              }}>
                {t('关联用户组')}
              </Button>
            }
          />
        </Table.ActionPanel>
        <GroupAssociateWorkflowDialog />
      </React.Fragment>
    );
  }

}

