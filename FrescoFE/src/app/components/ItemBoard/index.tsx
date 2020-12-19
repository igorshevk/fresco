import React, { useState } from 'react';
import { Col, Card, Image, Button } from 'antd';
import Meta from 'antd/lib/card/Meta';
import styled from 'styled-components';
import Text from 'antd/lib/typography/Text';

const img1 = require('../../../assets/images/img-default-1.png');
const img2 = require('../../../assets/images/img-default-2.png');

const ItemBoard = props => {
  const [isShown, setIsShown] = useState(false);
  return (
    <Col
      className="gutter-row"
      span={6}
      style={{
        padding: 30,
      }}
    >
      <Card
        hoverable
        cover={
          <Image
            width={'100%'}
            height={'30vh'}
            src={props.index % 2 === 0 ? img1 : img2}
          />
        }
        onMouseEnter={() => setIsShown(true)}
        onMouseLeave={() => setIsShown(false)}
      >
        <Meta title={props.item.name} />
        {isShown && (
          <Div>
            <div>
              <Meta title={'CJM 1'} style={{ paddingBottom: 5 }} />
              <Text>
                Use this template to create a shared understanding of customer
                aspirations and priorities Use this template to creat
              </Text>
            </div>
            <DivFlexEnd>
              <Button
                onClick={() => {
                  props.onCreateBoard(props.item.data, props.item.id);
                }}
              >
                Select
              </Button>
            </DivFlexEnd>
          </Div>
        )}
      </Card>
    </Col>
  );
};

const Div = styled.div`
  position: absolute;
  background-color: white;
  width: '100%';
  padding: 10px;
  left: -2px;
  right: -2px;
  bottom: 0;
`;

const DivFlexEnd = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 5px;
  margin-bottom: 5px;
`;

export default ItemBoard;
