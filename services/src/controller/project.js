import {Project} from '../modal';
import {createRes} from '../lib';
import {
  ProjectCreateValidator,
  ProjectUpdateValidator,
} from '../validators/project';

export default class ProjectCtl {
  /**
   * 创建项目
   * @param {Object} ctx
   */
  static async create(ctx) {
    const {
      name,
      apiPrefix,
      description,
      themeColor,
      collaborators = [],
    } = await new ProjectCreateValidator().v(ctx);

    const project = await new Project({
      name,
      apiPrefix,
      description,
      themeColor,
      themeMark: name[0],
      onwer: ctx.user?._id,
      collaborators,
    }).save();

    ctx.body = createRes.success(project);
  }

  /**
   * 获取项目列表
   * @param {Object} ctx
   */
  static async list(ctx) {
    const uid = ctx.user?._id;
    const projects = await Project.find({
      isDelete: false,
      $or: [
        {onwer: uid},
        {collaborators: {$elemMatch: {$eq: uid}}},
      ],
    }).sort({_id: -1});
    ctx.body = createRes.success(projects);
  }

  /**
   * 获取项目详情
   * @param {Object} ctx
   */
  static async detail(ctx) {
    const {_id} = ctx.request.params;
    const project = await Project.findOne({_id, isDelete: false}).populate({
      path: 'onwer collaborators',
      select: '_id name avatar',
    });

    ctx.body = createRes.success(project);
  }

  /**
   * 删除项目
   * @param {Object} ctx
   */
  static async delete(ctx) {
    const {_id} = ctx.request.params;

    const {deletedCount} = await Project.updateOne(
        {
          _id,
          onwer: ctx.user?._id,
        },
        {
          isDelete: true,
        },
    );

    ctx.body = createRes.success(deletedCount);
  }

  /**
   * 更新项目
   * @param {Object} ctx
   */
  static async update(ctx) {
    const {
      _id,
      name,
      apiPrefix,
      description,
      themeColor,
      collaborators,
    } = await new ProjectUpdateValidator().v(ctx);

    const uid = ctx.user?._id;

    const updates = {
      name,
      apiPrefix,
      description,
      themeColor,
    };
    const projrct = await Project.findOne({_id, onwer: uid});
    if (projrct) {
      updates.collaborators = collaborators;
    }

    await Project.updateOne(
        {
          _id,
          $or: [
            {onwer: uid},
            {collaborators: {$elemMatch: {$eq: uid}}},
          ],
        },
        updates,
    );

    ctx.body = createRes.success();
  }
}
