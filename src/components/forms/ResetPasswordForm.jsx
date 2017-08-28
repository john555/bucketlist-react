import React from 'react';

const ResetPasswordForm = props => {
    return <form onSubmit={props.onSubmit} 
    className={props.formClass}>
    <div className="overlay-header">
      <span className="o-title">Reset password</span>
    </div>
    <div className="overlay-body">
      <div className="form-group">
        <input onChange={props.onChange} 
          value={props.oldPasword}
          type="password" 
          className="form-control" 
          placeholder="Old password"
          required />
      </div>
      <div className="form-group">
        <input onChange={props.onChange} 
          value={props.newPassword}
          type="password" 
          className="form-control" 
          placeholder="New password"
          required />
      </div>
      <div className="form-group">
        <input onChange={props.onChange} 
          value={props.newPasswordRepeat}
          name="newPasswordRepeat" 
          type="password" 
          className="form-control" 
          placeholder="Repeat new password"
          required />
      </div>
      <div className="form-group buttons">
        <div className="right">
          <div className="form-feedback positive">
            <span className="feedback-icon">
              <i className="glyphicon glyphicon-ok"></i>
            </span>
            <span className="feedback-message">
              Password was reset.
            </span>
          </div>
          <div className="form-feedback negative">
            <span className="feedback-icon">
              <i className="glyphicon glyphicon-remove"></i>
            </span>
            <span className="feedback-message"></span>
          </div>
          <div className="form-feedback processing">
            <span className="feedback-icon loading"></span>
            <span className="feedback-message">Processing...</span>
          </div>
          <button className="btn btn-primary" disabled={props.isDisabled}>Reset password</button>
          <button onClick={props.close} className="btn btn-default">Close</button>
        </div>
        <div className="clearfix"></div>
      </div>
    </div>
  </form>
}

export default ResetPasswordForm;
