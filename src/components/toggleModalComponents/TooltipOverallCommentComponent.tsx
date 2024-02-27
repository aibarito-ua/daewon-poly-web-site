import * as React from 'react';
import Grid from '@mui/material/Grid';
import { styled } from '@mui/material/styles';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Estyled from '@emotion/styled'

const HtmlTooltip = styled(({ className, ...props }: TooltipProps) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      display: 'flex',
      maxWidth: 'none',
    flex: '1 1 0%',
    flexDirection: 'row',
      backgroundColor: 'rgba(0,0,0,0)',
      
      color: '#222',
      fontFamily: 'GothamRounded',
      fontSize: '13px',
      fontWeight: 'normal',
      fontStretch: 'normal',
      fontStyle: 'normal',
      lineHeight: 1.38,
      letterSpacing: 'normal',
      textAlign: 'left',
      border: '3px solid #21c4cc',
    },
  }));
  export const ArrowBubble = Estyled.div`
  display: flex;
  flex: 1 1 0%;
  flex-direction: row;
  position: relative;
  padding: 10px 10px;
  width: 100%;
  height: 85px;
  max-width: 900px;
  max-height: 85px;
  overflow-y: auto;
  overflow-x: hidden;
  background: #fff;

  /* -webkit-border-radius: 35px;
  -moz-border-radius: 35px; */
  border-radius: 10px;
  border: #21c4cc solid 3px;

  ::after {
    content: "";
    position: absolute;
    border-style: solid;
    border-width: 9px 3px 0;
    border-color: #fff transparent;
    display: block;
    width: 0;
    z-index: 50;
    top: 13px;
    right: -7px;
    rotate: 270deg;
  }

  ::before {
    content: "";
    position: absolute;
    border-style: solid;
    border-width: 15px 5px 0;
    border-color: #21c4cc transparent;
    display: block;
    width: 0;
    z-index: 0;
    top: 10px;
    right: -15px;
    rotate: 270deg;
  }`

export default function TooltipOverallCommentComponent(props: {
    buttonLabel: string;
    tooltipMessage: string;

}) {
    const {buttonLabel,tooltipMessage} = props;
  const [open, setOpen] = React.useState(false);

  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };
  const test = 'Good Writing. I like your idea. Good Writing. I like your idea. Good Writing. I like your idea. Good Writing. I like your idea.Good Writing. I like your idea. Good Writing. I like your idea. Good Writing. I like your idea. Good Writing. I like your idea. Good Writing. I like your idea. Good Writing. I like your idea. Good Writing. I like your idea. Good Writing. I like your idea.'
  
  return (
    <div className='w-full'>
      <Grid container justifyContent="center">
        <Grid item>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                className='w-[800px]'
                PopperProps={{
                  disablePortal: true,
                  sx:{
                    maxWidth: '1280px',
                    width: '700px',
                    height: '85px',
                  }
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                title={
                  <p className='w-full h-[85px]'>{test}</p>
                }
                placement='left-end'
              >
                <div className='overall-comment-2nd-draft-write-top-button' onClick={handleTooltipOpen}>{buttonLabel}</div>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </Grid>
      </Grid>
    </div>
  );
}