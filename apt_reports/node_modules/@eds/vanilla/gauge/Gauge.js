import * as d3 from 'd3v4';

export class Gauge {
  static setCanvas(selector, scale) {
    return d3.select(selector)
      .append('svg')
      .attr('width', 250 * scale)
      .attr('height', 250 * scale)
      .append('g')
      .attr('transform', 'translate(' + 125 * scale + ', ' + 125 * scale + ')');
  }

  static injectTexture() {
    const dTexture = window.document.querySelector('#diagonalTexture');
    if (dTexture === undefined) {
      d3.select('body')
        .append('svg')
        .append('defs')
        .append('pattern')
        .attr('id', 'diagonalTexture')
        .attr('width', 5)
        .attr('height', 5)
        .attr('patternUnits', 'userSpaceOnUse')
        .append('path')
        .attr('fill', 'white')
        .attr('stroke', '#767676')
        .attr('stroke-width', '1')
        .attr('d', 'M0 5L5 0ZM6 4L4 6ZM-1 1L1 -1Z');
    }
  }

  static getScale(size) {
    switch (size) {
      case 'small':
        return .5;
      case 'medium':
        return .75;
      case 'large':
        return 1;
      default:
        return .75;
    }
  }

  static createArc(options) {
    const s = options.scale || .75;
    return d3.arc()
      .innerRadius(options.radius.inner * s)
      .outerRadius(options.radius.outer * s)
      .startAngle(options.angle.start * (Math.PI / 180))
      .endAngle(options.angle.end * (Math.PI / 180));
  }

  static drawArc(canvas, options) {
    const createArc = Gauge.createArc;
    return canvas.append('path')
      .attr('class', options.props.class || 'arc')
      .attr('d', createArc(options.arc))
      .attr('fill', options.props.color)
      .attr('opacity', options.props.opacity || 1);
  }

  static drawLabel(canvas, options) {
    return canvas.append('g')
      .attr('transform', 'translate(' +
        (options.x * options.scale || 0) + ',' +
        (options.y * options.scale || 0) + ')')
      .append('text')
      .text(options.message)
      .style('font-size', (options.fontSize * options.scale) + 'px')
      .attr('class', options.class || 'text');
  }

  constructor(element) {
    this.dom = {
      gauge: element,
      id: element.getAttribute('id'),
      settings: element.dataset.settings,
      valueArc: undefined,
      valueLabel: undefined,
    };
    this.data = {};
  }

  init() {
    this.data = this.parseData();
    this.setDataDefaults();
    this.drawChart();
    Gauge.injectTexture();
    // this.setRandomData();
  }

  parseData() {
    return JSON.parse(this.dom.settings);
  }

  setDataDefaults() {
    this.data.value = this.data.value || 0;
    this.data.min = this.data.min || 0;
    this.data.max = this.data.max || 100;
    this.data.units = this.data.units || '%';
    this.data.scale = Gauge.getScale(this.data.size) || .75;
  }

  setValue(value) {
    const _parentThis = this;
    const valueArc = this.dom.valueArc;
    const arcTween = this.arcTween;
    const prevAngle = this.val2angle(this.data.value);
    const newAngle = this.val2angle(value);
    valueArc
      .transition()
      .duration(750)
      .attrTween('d', arcTween(newAngle, prevAngle, _parentThis));
    this.data.value = this.angle2value(newAngle);
  }

  setRandomData() {
    const _parentThis = this;
    d3.interval(function() {
      const randomAngle = Math.random() * 270 - 135;
      const randomValue = _parentThis.angle2value(randomAngle, _parentThis);
      _parentThis.setValue(randomValue);
    }, 1500);
  }

  val2angle(value) {
    const scale =
      d3.scaleLinear()
        .domain([this.data.min, this.data.max])
        .range([-135, 135]);
    return scale(value);
  }

  angle2value(angle, _parentThis) {
    const _this = _parentThis !== undefined ? _parentThis : this;
    const scale =
      d3.scaleLinear()
        .domain([-135, 135])
        .range([_this.data.min, _this.data.max]);
    return scale(angle);
  }

  setLabelAngle(angle, _parentThis) {
    const valueLabel = _parentThis.dom.valueLabel;
    const decimals = _parentThis.parseData().decimals;
    valueLabel.text(function() {
      return _parentThis.angle2value(angle, _parentThis).toFixed(decimals);
    });
  }

  arcTween(newAngle, oldAngle, _parentThis) {
    const createArc = Gauge.createArc;
    const setArcColor = _parentThis.setArcColor;
    const setLabelAngle = _parentThis.setLabelAngle;
    const angle2value = _parentThis.angle2value;
    return function(d) {
      const interpolate = d3.interpolate(oldAngle, newAngle);
      return function(t) {
        oldAngle = interpolate(t);
        const arc = createArc({
          angle: { start: -135, end: oldAngle },
          radius: { inner: 95, outer: 102 },
          scale: _parentThis.data.scale,
        });
        setLabelAngle(oldAngle, _parentThis);
        const decimals = _parentThis.data.decimals || 0;
        const val = angle2value(oldAngle, _parentThis);
        setArcColor(parseFloat(val).toFixed(decimals), _parentThis.data.limits, _parentThis);
        return arc(t);
      };
    };
  }

  setArcColor(value, limits, _parentThis) {
    const d = _parentThis !== undefined ? _parentThis.dom : this.dom;
    d.valueArc.attr('class', 'valueArc');
    if (limits) {
      Array.from(limits).forEach(limit => {
        if (value >= limit.from && value <= limit.to) {
          if (limit.color !== 'transparent'
            && limit.color !== 'unknown'
            && limit.color !== 'gray') {
            d.valueArc.attr('class', limit.color);
          }
        }
      });
    }
  }

  drawChart() {
    // variables
    const gScale = this.data.scale;

    //  set canvas
    const svg = Gauge.setCanvas('#' + this.dom.id, gScale);

    // foreground arc
    Gauge.drawArc(svg, {
      arc: {
        radius: { inner: 95, outer: 102 },
        angle: { start: -135, end: 135 },
        scale: gScale,
      },
      props: {
        class: 'foregroundArc',
      },
    });

    // value arc
    this.dom.valueArc = Gauge.drawArc(svg, {
      arc: {
        radius: { inner: 95, outer: 102 },
        angle: { start: -135, end: this.val2angle(this.data.value) },
        scale: gScale,
      },
      props: {
        class: 'valueArc',
      },
    });

    // set value arc color
    this.setArcColor(this.data.value, this.data.limits);

    // negative arcs
    const frequency = 275 / 37, length = 5;
    for (let i = -140; i < 135; i = i + frequency) {
      Gauge.drawArc(svg, {
        arc: {
          radius: { inner: 94, outer: 103 },
          angle: { start: i, end: i + length },
          scale: gScale,
        },
        props: {
          class: 'negativeArc',
        },
      });
    }

    // draw limits
    if (this.data.limits) {
      Array.from(this.data.limits).forEach(limit => {
        const limitArc = Gauge.drawArc(svg, {
          arc: {
            radius: { inner: 82, outer: 87 },
            angle: {
              start: this.val2angle(limit.from) + 1,
              end: this.val2angle(limit.to) - 1,
            },
            scale: gScale,
          },
          props: {
            class: limit.color,
            opacity: 0.3,
          },
        });

        // limit hover arc
        const limitHoverArc = Gauge.drawArc(svg, {
          arc: {
            radius: { inner: 72, outer: 117 },
            angle: {
              start: this.val2angle(limit.from) + 1,
              end: this.val2angle(limit.to) - 1,
            },
            scale: gScale,
          },
          props: {
            class: 'transparent',
          },
        });

        // tooltip
        const tooltip =
          d3.select('#' + this.dom.id)
            .append('div')
            .attr('class', 'tooltip hidden')
            .style('left', '0px')
            .style('top', '0px')
            .html(limit.label);

        // animation
        limitHoverArc.on('mouseenter', () => {
          tooltip.node().classList.remove('hidden');
          limitArc.style('opacity', 1);
        });
        limitHoverArc.on('mousemove', () => {
          tooltip.style('left', d3.event.clientX + 'px').style('top', d3.event.clientY - 40 + 'px');
        });
        limitHoverArc.on('mouseleave', () => {
          tooltip.node().classList.add('hidden');
          limitArc.style('opacity', 0.3);
        });
      });
    }

    // labels
    Gauge.drawLabel(svg, {
      message: this.data.units,
      class: 'units',
      x: 0,
      y: 40,
      fontSize: 28,
      scale: gScale,
    });

    Gauge.drawLabel(svg, {
      message: this.data.min,
      class: 'label left',
      x: -65,
      y: 110,
      fontSize: 24,
      scale: gScale,
    });

    Gauge.drawLabel(svg, {
      message: this.data.max,
      class: 'label right',
      x: 65,
      y: 110,
      fontSize: 24,
      scale: gScale,
    });

    this.dom.valueLabel = Gauge.drawLabel(svg, {
      message: this.data.value,
      class: 'total',
      fontSize: 60,
      scale: gScale,
    });
  }
}
