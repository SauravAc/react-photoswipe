import React from 'react';
import PropTypes from 'prop-types';
import Photoswipe from 'photoswipe';
import PhotoswipeUIDefault from 'photoswipe/dist/photoswipe-ui-default';
import classnames from 'classnames';
import events from './events';

class PhotoSwipe extends React.Component {
  static propTypes = {
    isOpen: PropTypes.bool.isRequired,
    items: PropTypes.array.isRequired,
    options: PropTypes.object, // eslint-disable-line react/no-unused-prop-types
    onClose: PropTypes.func,
    id: PropTypes.string,
    className: PropTypes.string,
    additionalButtons: PropTypes.array,
  };

  static defaultProps = {
    options: {},
    onClose: () => {
    },
    id: '',
    className: '',
    additionalButtons: [],
  };

  state = {
    isOpen: this.props.isOpen
  };

  componentDidMount = () => {
    const { isOpen } = this.state;
    if (isOpen) {
      this.openPhotoSwipe(this.props);
    }
  };

  componentWillReceiveProps = (nextProps) => {
    const { isOpen } = this.state;
    if (nextProps.isOpen) {
      if (!isOpen) {
        this.openPhotoSwipe(nextProps);
      } else {
        this.updateItems(nextProps.items);
      }
    } else if (isOpen) {
      this.closePhotoSwipe();
    }
  };

  componentWillUnmount = () => {
    this.closePhotoSwipe();
  };

  openPhotoSwipe = (props) => {
    const { items, options } = props;
    const pswpElement = this.pswpElement;
    this.photoSwipe = new Photoswipe(pswpElement, PhotoswipeUIDefault, items, options);
    events.forEach((event) => {
      const callback = props[event];
      if (callback || event === 'destroy') {
        const self = this;
        this.photoSwipe.listen(event, function (...args) {
          if (callback) {
            args.unshift(this);
            callback(...args);
          }
          if (event === 'destroy') {
            self.handleClose();
          }
        });
      }
    });
    this.setState({
      isOpen: true
    }, () => {
      this.photoSwipe.init();
    });
  };

  updateItems = (items = []) => {
    this.photoSwipe.items.length = 0;
    items.forEach((item) => {
      this.photoSwipe.items.push(item);
    });
    this.photoSwipe.invalidateCurrItems();
    this.photoSwipe.updateSize(true);
  };

  closePhotoSwipe = () => {
    if (!this.photoSwipe) {
      return;
    }
    this.photoSwipe.close();
  };

  handleClose = () => {
    const { onClose } = this.props;
    this.setState({
      isOpen: false
    }, () => {
      if (onClose) {
        onClose(this.photoSwipe);
      }
    });
  };

  render() {
    const { id } = this.props;
    let { className } = this.props;
    className = classnames(['pswp', className]).trim();
    return (
      <div
        id={id}
        className={className}
        tabIndex="-1"
        role="dialog"
        aria-hidden="true"
        ref={(node) => {
          this.pswpElement = node;
        }}
      >
        <div className="pswp__bg"/>
        <div className="pswp__scroll-wrap">
          <div className="pswp__container">
            <div className="pswp__item"/>
            <div className="pswp__item"/>
            <div className="pswp__item"/>
          </div>
          <div className="pswp__ui pswp__ui--hidden">
            <div className="pswp__top-bar">
              <div className="pswp__counter"/>
              <button
                className="pswp__button pswp__button--close"
                title="Close (Esc)"
              />
              <button
                className="pswp__button pswp__button--share"
                title="Share"
              />
              <button
                className="pswp__button pswp__button--fs"
                title="Toggle fullscreen"
              />
              <button className="pswp__button pswp__button--zoom" title="Zoom in/out"/>
              {this.props.additionalButtons && this.props.additionalButtons.map(button => (
                <i
                  title={button.title}
                  className={`pswp__button pswp__button--extra ${button.className}`}
                  onClick={e => button.onClick(this.photoSwipe, e)}
                  style={{ margin: '15px 14px', width: 10 }}
                />
              ))}
              <div className="pswp__preloader">
                <div className="pswp__preloader__icn">
                  <div className="pswp__preloader__cut">
                    <div className="pswp__preloader__donut"/>
                  </div>
                </div>
              </div>
            </div>
            <div className="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
              <div className="pswp__share-tooltip"/>
            </div>
            <button
              className="pswp__button pswp__button--arrow--left"
              title="Previous (arrow left)"
            />
            <button
              className="pswp__button pswp__button--arrow--right"
              title="Next (arrow right)"
            />
            <div className="pswp__caption">
              <div className="pswp__caption__center"/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default PhotoSwipe;
